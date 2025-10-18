package service

import (
	"archive/zip"
	"bytes"
	"errors"
	"fmt"
	"github.com/disintegration/imaging"
	"github.com/duke-git/lancet/v2/fileutil"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"golang.org/x/text/encoding/simplifiedchinese"
	"golang.org/x/text/transform"
	"image"
	"image/jpeg"
	"image/png"
	"io"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"strings"
)

func getMyRootPath() string {
	return strings.TrimSpace(viper.GetString("filebrowser.root"))
}

// The above function can be inserted directly below the import statements.
// Define a function to resize an image
func ResizeImage(inputPath string, outputPath string, width int, height int) error {
	// Open the input file
	inputFile, err := os.Open(inputPath)
	if err != nil {
		return err
	}
	defer inputFile.Close()

	// Decode the input image
	inputImage, _, err := image.Decode(inputFile)
	if err != nil {
		return err
	}
	outputImage := imaging.Resize(inputImage, width, height, imaging.Lanczos)
	if _, err := os.Stat(filepath.Dir(outputPath)); os.IsNotExist(err) {
		os.MkdirAll(filepath.Dir(outputPath), 0644)
	}
	outputFile, err := os.Create(outputPath)

	if err != nil {
		return err
	}
	defer outputFile.Close()
	// Encode the output image
	switch filepath.Ext(outputPath) {
	case ".jpg", ".jpeg":
		err = jpeg.Encode(outputFile, outputImage, &jpeg.Options{Quality: 80})
	case ".png":
		err = png.Encode(outputFile, outputImage)
	default:
		err = errors.New("unsupported output format")
	}
	if err != nil {
		return err
	}

	return nil
}

// 下载压缩
func ZipFiles(source, arr []string) (string, error) {

	if _, err := os.Stat("./download"); os.IsNotExist(err) {
		if err = os.Mkdir("./download", os.ModePerm); err != nil {
			return "", err
		}
	}
	zipFile, err := os.Create("./download/all.zip")
	if err != nil {
		return "", err
	}
	defer zipFile.Close()
	// Create a new zip writer
	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()
	// Walk through the directory and add all files to the zip archive
	for _, s := range source {
		file, err1 := os.Open(s)
		if err1 != nil {
			return "", err1
		}
		defer file.Close()
		// Create a new file in the zip archive
		rootRel, _ := filepath.Rel(filepath.Dir(arr[0]), s)
		//rootPath := filepath.Dir(s)
		//rel, _ := filepath.Rel(rootPath, s)
		zipFileT, err2 := zipWriter.Create(rootRel)
		if err2 != nil {
			return "", err2
		}
		// Copy the file to the zip archive
		_, err3 := io.Copy(zipFileT, file)
		if err3 != nil {
			return "", err3
		}
	}
	return zipFile.Name(), nil

}

// 遍历目录方法
//ture 不包含文件夹

func GetAllFile(folder string, flag bool) ([]string, error) {
	//var result []string
	result := make([]string, 0)
	filepath.Walk(folder, func(path string, fi os.FileInfo, err error) error {
		if err != nil {
			zap.L().Error("遍历目录错误", zap.Error(err))
			return err
		}
		if flag {
			if !fi.IsDir() {
				//如果想要忽略这个目录，请返回filepath.SkipDir，即：
				//return filepath.SkipDir
				result = append(result, path)
			}

		} else {
			result = append(result, path)
		}
		return nil
	})
	return result, nil
}

// 判断文件或者文件夹在所在目录是否有重复  false不重复,true重复
func IsRepeatPath(realPath string) bool {

	_, err := os.Stat(realPath)
	if os.IsNotExist(err) {
		return false
	}
	return true
}

// 替换
func Replace(path, destPath, realPath string) error {
	//先删除原来的
	err := os.RemoveAll(realPath)
	if err != nil {
		return err
	}
	if err1 := os.Rename(path, realPath); err != nil {
		return err1
	}
	return nil
}

// 重名
func RenamePath(realPath string) string {

	count := 0
	flag := realPath
	for {
		if count != 0 {
			realPath = flag
			//这里面还要判断路径类型
			destPathInfo, err := os.Stat(realPath)

			if err != nil {
				return ""
			}

			if destPathInfo.IsDir() {
				realPath = fmt.Sprintf("%s(%d)", realPath, count)

			} else {
				tempSplit := strings.Split(realPath, ".")
				realPath = fmt.Sprintf("%s(%d).%s", tempSplit[0], count, tempSplit[1])
			}

		}

		if !IsRepeatPath(realPath) {
			break
		}

		count++
	}
	return realPath
}

// 解压 ZIP 文件
func Unzip(src, dest string) error {
	// 打开 zip 文件
	r, err := zip.OpenReader(src)
	if err != nil {
		return err
	}
	defer r.Close()

	// 遍历 zip 文件中的所有文件和目录
	for _, f := range r.File {

		//fNames = append(fNames, filepath.Clean(f.Name))

		fName := filepath.Clean(f.Name)
		if fName == "." {
			return errors.New("The file path is empty ")
		}
		decodeName := ""
		if f.Flags == 0 { //如果标致位是0  则是默认的本地编码   默认为gbk
			i := bytes.NewReader([]byte(fName))
			decoder := transform.NewReader(i, simplifiedchinese.GB18030.NewDecoder())
			content, _ := io.ReadAll(decoder)
			decodeName = string(content)
		} else { //如果标志为是 1 << 11也就是 2048  则是utf-8编码
			decodeName = fName
		}

		// 构建文件路径
		path := filepath.Join(dest, decodeName)
		// 如果是目录，则创建目录
		if f.FileInfo().IsDir() {
			os.MkdirAll(path, f.Mode())
			continue
		}
		// 如果是文件，则解压并写入磁盘
		srcFile, err1 := f.Open()
		if err1 != nil {
			return err1
		}
		defer srcFile.Close()

		destFile, err2 := os.OpenFile(path, os.O_WRONLY|os.O_CREATE|os.O_TRUNC, f.Mode())
		if err2 != nil {
			return err2
		}
		defer destFile.Close()

		_, err4 := io.Copy(destFile, srcFile)
		if err4 != nil {
			return err4
		}
	}

	return nil
}

// 判断文件类型
func GetFileType(absPath string) (string, error) {
	file, err := os.Open(absPath)
	if err != nil {
		return "", err
	}
	defer file.Close()
	// 读取前 512 个字节的内容
	buffer := make([]byte, 512)
	_, _ = file.Read(buffer)
	// 判断文件类型
	fileType := http.DetectContentType(buffer)
	return fileType, err
}

// 复制整个目录
func CopyDir(src string, dst string) error {
	var err error
	var fds []os.DirEntry
	var srcinfo os.FileInfo

	if srcinfo, err = os.Stat(src); err != nil {
		return err
	}

	if err = os.MkdirAll(dst, srcinfo.Mode()); err != nil {
		return err
	}

	fds, err = os.ReadDir(src)
	if err != nil {
		return err
	}

	for _, fd := range fds {
		srcfp := path.Join(src, fd.Name())
		dstfp := path.Join(dst, fd.Name())

		if fd.IsDir() {

			if err = CopyDir(srcfp, dstfp); err != nil {
				return err
			}
		} else {
			if err = fileutil.CopyFile(srcfp, dstfp); err != nil {
				return err
			}
		}
	}
	return nil
}
