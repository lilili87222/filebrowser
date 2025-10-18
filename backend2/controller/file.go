package controller

import (
	"encoding/json"
	"filebrowser/service"
	"fmt"
	"github.com/duke-git/lancet/v2/fileutil"
	"github.com/kataras/iris/v12"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"image"
	"io/fs"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strings"
)

/*
*
目前单用户直接从配置读取
*/
func getMyRootPath() string {
	return strings.TrimSpace(viper.GetString("filebrowser.home"))
}
func getMyCachePath() string {
	return strings.TrimSpace(viper.GetString("filebrowser.cache"))
}

/*
*
对myroot建立一个文件系统，然后对此文件系统进行遍历指定的路径
*/
func listFilesInnner(targetPath string, ctx iris.Context) (map[string]any, error) {
	targetPath = filepath.ToSlash(targetPath)
	root := os.DirFS(getMyRootPath())
	dirinfo, e1 := fs.Stat(root, targetPath)
	//dirinfo2, e2 := fs.Stat(root, "/")
	//fmt.Println(dirinfo2, e2)
	if e1 != nil {
		return nil, e1
	}
	curItem := map[string]any{"name": dirinfo.Name(), "isFile": !dirinfo.IsDir(), "size": dirinfo.Size(), "modified": dirinfo.ModTime(), "extension": filepath.Ext(dirinfo.Name()), "path": targetPath}
	dirs, e := fs.ReadDir(root, targetPath)
	if e != nil {
		return curItem, e
	}
	var items []map[string]any
	for _, dir := range dirs {
		info, _ := dir.Info()

		pt := targetPath + "/" + info.Name()
		if targetPath == "." {
			pt = info.Name()
		}
		fileType, _ := service.GetFileType(filepath.Join(getMyRootPath(), pt))
		//file, _ := os.Open(filepath.Join(getMyRootPath(ctx), pt))
		//
		//defer file.Close()
		//
		//// 读取前 512 个字节的内容
		//buffer := make([]byte, 512)
		//_, _ = file.Read(buffer)
		//// 判断文件类型
		//fileType := http.DetectContentType(buffer)
		item := map[string]any{"name": dir.Name(), "isFile": !dir.IsDir(), "size": info.Size(), "modified": info.ModTime(), "extension": filepath.Ext(dir.Name()), "path": pt, "filetype": fileType}
		items = append(items, item)
	}
	curItem["items"] = items
	return curItem, nil
}
func listFilesInnner2(absPath string) (map[string]any, error) {
	dirinfo, e1 := os.Stat(absPath)
	if e1 != nil {
		return nil, e1
	}
	curItem := map[string]any{"name": dirinfo.Name(), "isFile": !dirinfo.IsDir(), "size": dirinfo.Size(), "modified": dirinfo.ModTime(), "extension": filepath.Ext(dirinfo.Name()), "path": absPath}

	dirs, e := os.ReadDir(absPath)
	if e != nil {
		return curItem, e
	}
	var items []map[string]any
	for _, dir := range dirs {
		info, _ := dir.Info()
		item := map[string]any{"name": dir.Name(), "isFile": !dir.IsDir(), "size": info.Size(), "modified": info.ModTime(), "extension": filepath.Ext(dir.Name()), "path": filepath.Join(absPath, dir.Name())}
		items = append(items, item)
	}
	curItem["items"] = items
	return curItem, nil
}

// @Param path query  string false "文件路径"
// @Router /file/list [get]
func ListFiles(ctx iris.Context) {

	path := ctx.URLParam("path")
	itms, e := listFilesInnner(path, ctx)
	if e != nil {
		zap.L().Error("刷新列表失败", zap.Error(e))
		FailWithMessage("刷新失败,服务出错", ctx)
		return
	}
	OkWithDetailed(itms, "", ctx)
}
func ListFiles2(ctx iris.Context) { //TODO session存储为用户的id  以及登录时的次数刷新使用数据库
	path := ctx.URLParam("path")
	var absPath string
	if path == "." {
		absPath = filepath.Join(getMyRootPath(), path)
	} else {
		absPath = path
	}

	itms, e := listFilesInnner(absPath, ctx)
	if e != nil {
		ctx.StopWithJSON(http.StatusInternalServerError, e.Error())
		return
	} else {
		ctx.StopWithJSON(http.StatusOK, itms)
	}
	OkWithData(itms, ctx)

}

// @Param path query  string true "文件路径"
// @Param force query  bool false "强制"
// @Router /file/delete [post]
func DeleteFile(ctx iris.Context) {
	path := ctx.URLParam("path")
	if path == "." {
		FailWithMessage("该目录是根目录，请勿删除", ctx)
		return
	}
	force := ctx.URLParam("force")
	//absPath := fmt.Sprintf("%s%s", os.DirFS(getMyRootPath(ctx)), path)
	absPath := filepath.Join(getMyRootPath(), path)
	var e error
	if force == "true" {
		e = os.RemoveAll(absPath)
	} else {
		e = os.Remove(absPath)
	}
	if e != nil {
		zap.L().Error("删除错误", zap.Error(e))
		FailWithMessage("删除失败，请确定是否选中文件或目录", ctx)
		return
	}
	rel, _ := filepath.Rel(getMyRootPath(), filepath.Dir(absPath))
	d, _ := listFilesInnner(rel, ctx)
	OkWithDetailed(d, "", ctx)

}

// @Param path query  string true "文件路径"
// @Param name query  string true "新名称"
// @Router /file/rename [post]
func RenameFile(ctx iris.Context) {
	path := ctx.URLParam("path")
	if path == "." {
		FailWithMessage("该目录是根目录，请勿重命名", ctx)
		return
	}
	name := ctx.URLParam("name")
	absPath := filepath.Join(getMyRootPath(), path)
	newPath := filepath.Join(filepath.Dir(absPath), name)
	repeatPath := service.IsRepeatPath(newPath)
	if repeatPath {
		FailWithMessage("重命名失败,请确定该目录下是否有重名文件或目录", ctx)
		return
	}

	e := os.Rename(absPath, newPath)
	if e != nil {
		zap.L().Error("重命名错误", zap.Error(e))
		FailWithMessage("重命名失败,服务器出错了", ctx)
		return
	}
	rel, _ := filepath.Rel(getMyRootPath(), filepath.Dir(absPath))
	d, _ := listFilesInnner(rel, ctx)
	OkWithDetailed(d, "", ctx)

}

// @Param path query  string true "文件路径"
// @Param dest query  string true "目标路径"
// @Router /file/move [post]
func MoveFile(ctx iris.Context) {
	//获取请求参数
	path := ctx.URLParam("path")
	absPath := filepath.Join(getMyRootPath(), path)
	dest := ctx.URLParam("dest")
	destPath := filepath.Join(getMyRootPath(), dest)
	realPath := filepath.Join(destPath, filepath.Base(path))

	//判断是否是在当前目录移动
	if filepath.Dir(absPath) == destPath {
		OkWithMessage("", ctx)
		return
	}
	//判断是否有重复文件或目录true是重复，false是不重复
	if service.IsRepeatPath(realPath) {
		OkWithDetailed(iris.Map{"path": path, "destPath": dest, "flag": true}, "", ctx)
		return
		//ctx.StopWithJSON(iris.StatusOK, iris.Map{"path": path, "destPath": destPath, "realPath": realPath, "flag": true})
	} else {
		e := os.Rename(absPath, realPath)
		if e != nil {

			zap.L().Error("移动错误", zap.Error(e))
			FailWithMessage("移动文件出错，服务器出错了", ctx)
			return
		}
		d, _ := listFilesInnner(dest, ctx)
		OkWithDetailed(d, "", ctx)
	}
}
func MoveAction(ctx iris.Context) {
	path := ctx.URLParam("path")
	destPath := ctx.URLParam("destPath")
	absPath := filepath.Join(getMyRootPath(), path)
	absDestPath := filepath.Join(getMyRootPath(), destPath)
	realPath := filepath.Join(absDestPath, filepath.Base(absPath))
	action := ctx.Params().Get("action")
	if action == "replace" {
		err := service.Replace(absPath, absDestPath, realPath)
		if err != nil {
			zap.L().Error("替换文件失败", zap.Error(err))
			FailWithMessage("替换失败，服务器出错了", ctx)
			return
		}
		d, _ := listFilesInnner(destPath, ctx)
		OkWithDetailed(d, "", ctx)
	} else {
		renamePath := service.RenamePath(realPath)
		err := os.Rename(absPath, renamePath)
		if err != nil {
			zap.L().Error("重命名文件出错", zap.Error(err))
			FailWithMessage("重命名失败，服务器出错了", ctx)
			return
		}
		d, _ := listFilesInnner(destPath, ctx)
		OkWithDetailed(d, "", ctx)
	}

}

// @Param path query  string true "文件路径"
// @Param name query  string true "新建文件名"
// @Router /file/create [post]
func CreateFile(ctx iris.Context) {
	//creatType := "file"
	//获取参数
	path := ctx.URLParam("path")
	name := ctx.URLParam("name")
	//创建文件
	absPath := filepath.Join(getMyRootPath(), path, name)
	//if filepath.Ext(absPath) == "" {
	//	absPath = fmt.Sprintf("%s%s", absPath, ".md")
	//}
	if service.IsRepeatPath(absPath) {

		FailWithMessage("与文件或目录重命名，请修改文件名或添加文件后缀", ctx)
		return
	}
	//renamePath := service.RenamePath(absPath)
	f, err := os.Create(absPath)
	defer f.Close()
	if err != nil {
		zap.L().Error("创建文件错误", zap.Error(err))
		FailWithMessage("创建失败，请选择正确路径", ctx)
		return
	}
	d, _ := listFilesInnner(path, ctx)
	OkWithDetailed(d, "", ctx)

}

// @Param path query  string true "文件路径"
// @Param name query  string true "新建文件名"
// @Router /file/create [post]
func NewMdFile(ctx iris.Context) {
	//获取参数
	path := ctx.URLParam("path")
	name := ctx.URLParam("name")
	fullname := fmt.Sprintf("%s%s", name, ".md")
	absPath := filepath.Join(getMyRootPath(), path, fullname)

	//创建文件

	if service.IsRepeatPath(absPath) {
		FailWithMessage("此目录有重名文章,请修改文章名", ctx)
		return
	}
	//renamePath := service.RenamePath(absPath)
	f, err := os.Create(absPath)
	defer f.Close()
	if err != nil {
		zap.L().Error("创建文件错误", zap.Error(err))
		FailWithMessage("创建失败，请选择正确路径", ctx)
		return
	}
	str := "+++" +
		"\n" + "title = " + "\"" + name + "\"" +
		"\ndescription = \"\"" +
		"\nweight = 1" +
		"\n" +
		"+++"
	_, _ = f.WriteString(str) // 写入数据
	d, _ := listFilesInnner(path, ctx)
	OkWithDetailed(d, "", ctx)

}

// @Param path query  string true "文件夹路径"
// @Param name query  string true "新建文章名"
// @Router /file/mkdir [post]
func CreateFolder(ctx iris.Context) {
	//获取请求参数
	path := ctx.URLParam("path")
	name := ctx.URLParam("name")

	absPath := filepath.Join(getMyRootPath(), path, name)

	if service.IsRepeatPath(absPath) {
		FailWithMessage("此目录有重名目录或文件，请修改目录名", ctx)
		return
	}
	//创建目录
	//renamePath := service.RenamePath(absPath)
	err := os.Mkdir(absPath, 0755)
	if err != nil {
		zap.L().Error("创建目录出错", zap.Error(err))
		FailWithMessage("创建失败，请选择正确路径", ctx)
		return
	}
	d, _ := listFilesInnner(path, ctx)
	OkWithDetailed(d, "", ctx)

}

var imagePath string

// @Param path query  string true "文件路径"
// @Router /file/read [get]
func ReadFile(ctx iris.Context) {

	path := ctx.URLParam("path")
	absPath := filepath.Join(getMyRootPath(), path)
	imagePath = path
	//判断文件类型
	fileType, err := service.GetFileType(absPath)
	if err != nil {
		FailWithMessage("该文件不存在或权限不足，请刷新重试", ctx)
		return
	}
	// 判断文件是否为图片文件
	if strings.Contains(fileType, "image") {
		ctx.ServeFile(absPath)
	} else {
		content, e := os.ReadFile(absPath)
		if e != nil {
			zap.L().Error("读取文件出错", zap.Error(err))
			FailWithMessage("打开失败，服务器出错了", ctx)
			return
		} else {

			OkWithDetailed(string(content), "", ctx)
			return
		}
	}
}

//func ShowMdImg(ctx iris.Context) {
//	path := filepath.Dir(filepath.Dir(imagePath))
//	file := ctx.Params().Get("file")
//	p := filepath.Join(getMyRootPath(ctx), path, "images", file)
//	ctx.ServeFile(p)
//}

// @Param path query  string true "文件路径"
// @Router /file/download [post]
func DownloadFile(ctx iris.Context) {
	value := ctx.FormValue("path")
	//value = filepath.Join(getMyRootPath(ctx), value)
	var arr []string
	_ = json.Unmarshal([]byte(value), &arr)

	for i, s := range arr {
		arr[i] = filepath.Join(getMyRootPath(), s)
	}
	statfirst, _ := os.Stat(arr[0])

	isdir := statfirst.IsDir()
	if len(arr) > 1 || isdir {
		var filelist []string
		for _, s := range arr {
			stat, _ := os.Stat(s)
			dir := stat.IsDir()
			if dir {
				folder, err := service.GetAllFile(s, true)
				if err != nil {
					zap.L().Error("获取请求文件列表出错", zap.Error(err))
					FailWithDetailed(err.Error(), "服务器出错了", ctx)
					return
				}
				filelist = append(filelist, folder...)
			} else {
				filelist = append(filelist, s)
			}
		}

		zippath, err := service.ZipFiles(filelist, arr)
		if err != nil {
			zap.L().Error("文件打包压缩出错", zap.Error(err))
			FailWithMessage("打包文件失败，请重试", ctx)
			return
		}
		ctx.SendFile(zippath, filepath.Base(zippath))
	} else {
		absPath := arr[0]
		ctx.SendFile(absPath, filepath.Base(absPath))

	}
}

// @Param path query  string true "文件夹路径"
// @Param file formData file true "上传的文件"
// @Router /file/upload [post]
func UploadFile(ctx iris.Context) {
	path := ctx.URLParam("path")
	absPath := filepath.Join(getMyRootPath(), path)
	//if filepath.Ext(absPath)!=""{
	//
	//}
	_, _, err := ctx.UploadFormFiles(absPath)
	if err != nil {
		zap.L().Error("上传文件出错", zap.Error(err))
		FailWithMessage("上传失败,请重试", ctx)
		return
	}
	d, _ := listFilesInnner(path, ctx)

	OkWithDetailed(d, "", ctx)

}

func UploadDir(ctx iris.Context) {
	// 获取上传的目标路径
	path := ctx.URLParam("path")
	absPath := filepath.Join(getMyRootPath(), path)

	//获取通过iris.WithPostMaxMemory获取的最大上传值大小。
	maxSize := ctx.Application().ConfigurationReadOnly().GetPostMaxMemory()
	err := ctx.Request().ParseMultipartForm(maxSize)
	if err != nil {
		zap.L().Error("上传文件夹出错", zap.Error(err))
		FailWithMessage("上传失败，文件数量过多", ctx)
		return
	}
	form := ctx.Request().MultipartForm
	files := form.File["file"]
	for _, file := range files {
		str := file.Header.Get("Content-Disposition")
		index1 := strings.Index(str, "filename=")
		filename := strings.Trim(str[index1+len("filename="):], "\"")

		//创建目录
		savePath := filepath.Join(absPath, filename)
		subDir := filepath.Dir(savePath)
		err = os.MkdirAll(subDir, os.ModePerm)
		if err != nil {
			zap.L().Error("创建上传资源文件夹出错", zap.Error(err))
			FailWithMessage("上传失败，服务器错误", ctx)
			return
		}
		ctx.SaveFormFile(file, savePath)

	}
	d, _ := listFilesInnner(path, ctx)
	OkWithDetailed(d, "", ctx)

}

func UploadMdFile(ctx iris.Context) {
	path := ctx.URLParam("path")
	parentDir := filepath.Dir(path)
	absPath := filepath.Join(getMyRootPath(), parentDir)
	var err error
	_, err = os.Stat(absPath)
	if err != nil {
		// 目录不存在，创建目录
		if os.IsNotExist(err) {
			err = os.MkdirAll(absPath, os.ModePerm)
			if err != nil {
				zap.L().Error("创建资源目录出错", zap.Error(err))
				FailWithMessage("创建资源目录失败", ctx)
				return
			}
		}
	}
	files, _, err := ctx.UploadFormFiles(absPath, beforeSave)
	//打开本地md显示图片
	//files, _, err := ctx.UploadFormFiles(filepath.Dir(path))
	if err != nil {
		zap.L().Error("上传md图片出错", zap.Error(err))
		FailWithMessage("上传失败,服务器错误", ctx)
		return
	}
	var fileArr []string
	for _, file := range files {
		fileArr = append(fileArr, filepath.ToSlash(fmt.Sprintf(file.Filename)))
	}
	OkWithDetailed(fileArr, "上传成功", ctx)

}

// 文件上传前的操作
func beforeSave(ctx iris.Context, file *multipart.FileHeader) bool {

	//确保以某种方式格式化ip
	//可以用于文件名（简单情况）：
	file.Filename = strings.ReplaceAll(file.Filename, "(", "_")
	file.Filename = strings.ReplaceAll(file.Filename, ")", "")
	return true
}

// @Summary   解压ZIP
// @Description   解压文件
// @Param path query  string true "文件路径"
// @Router /file/unzip [get]
func Unzip(ctx iris.Context) {
	path := ctx.URLParam("path")
	absPath := filepath.Join(getMyRootPath(), path)
	err := service.Unzip(absPath, filepath.Dir(absPath))
	if err != nil {
		zap.L().Error("解压文件出错", zap.Error(err))
		FailWithMessage("解压失败，服务器出错", ctx)
		return
	}
	rel, _ := filepath.Rel(getMyRootPath(), filepath.Dir(absPath))
	d, _ := listFilesInnner(rel, ctx)
	OkWithDetailed(d, "", ctx)
}

// @Param path query  string true "文件路径"
// @Router /file/preview [get]
func PreviewFile(ctx iris.Context) {
	path := ctx.URLParam("path")
	absPath := filepath.Join(getMyRootPath(), path)
	cachePath := filepath.Join(getMyCachePath(), path)
	extension := filepath.Ext(absPath)
	if extension == ".jpg" || extension == ".jpeg" || extension == ".png" {
		previewFile := absPath
		// Check if the cachePath directory exists
		inputFile, err1 := os.Open(absPath)
		if err1 != nil {
			ctx.StopWithJSON(http.StatusBadRequest, "File type not supported for preview")
			return
		}
		inputImage, _, err := image.DecodeConfig(inputFile)
		inputFile.Close()
		if err != nil {
			ctx.StopWithJSON(http.StatusBadRequest, "File type not supported for preview")
			return
		}
		if inputImage.Width > 120 || inputImage.Height > 120 {
			if _, err3 := os.Stat(cachePath); os.IsNotExist(err3) {
				e := service.ResizeImage(absPath, cachePath, 120, 120)
				if e == nil {
					previewFile = cachePath
				}
			}
		}
		ctx.ServeFile(previewFile)
	} else if extension == ".gif" {
		ctx.ServeFile(absPath)
	} else {
		ctx.StopWithJSON(http.StatusBadRequest, "File type not supported for preview")
	}
}

// @Param path query  string true "文件路径"
// @Param content query  string true "文件内容"
// @Router /file/save [post]
func SaveFile(ctx iris.Context) {
	path := ctx.FormValue("path")
	absPath := filepath.Join(getMyRootPath(), path)
	content := ctx.FormValue("content")
	e := os.WriteFile(absPath, []byte(content), 0644)
	if e != nil {
		zap.L().Error("写入文件内容错误", zap.Error(e))
		FailWithMessage("保存失败,请重试", ctx)
		return
	}
	//if filepath.Ext(absPath) == ".md" {
	//	flag := true
	//	err := service.BuildSite(absPath, flag)
	//	if err != nil {
	//		zap.L().Error("构建站点出错", zap.Error(err))
	//		FailWithMessage("请正确书写配置文件和MD文件或确定功能正常", ctx)
	//		return
	//	}
	//}
	//rel, _ := filepath.Rel(getMyRootPath(ctx), filepath.Dir(absPath))
	//d, _ := listFilesInnner(rel, ctx)
	OkWithMessage("保存成功", ctx)

}

func Search(ctx iris.Context) {
	filename := ctx.URLParam("name")
	searchPath := ctx.URLParam("path")

	filelist, err := service.GetAllFile(filepath.Join(getMyRootPath(), searchPath), false)

	if err != nil {
		zap.L().Error("文件搜索出错", zap.Error(err))
		FailWithMessage("搜查服务出错，服务出错", ctx)
		return
	}
	if len(filelist) > 1 {
		filelist = filelist[1:]
	}
	searchPath = filepath.ToSlash(searchPath)
	root := os.DirFS(getMyRootPath())
	dirinfo, _ := fs.Stat(root, searchPath)

	//if e1 != nil {
	//	return nil
	//}

	curItem := map[string]any{"name": dirinfo.Name(), "isFile": !dirinfo.IsDir(), "size": dirinfo.Size(), "modified": dirinfo.ModTime(), "extension": filepath.Ext(dirinfo.Name()), "path": searchPath}
	var items []map[string]any
	for _, s := range filelist {
		s = filepath.ToSlash(s)
		stat, _ := os.Stat(s)
		newstr := strings.TrimLeft(s, getMyRootPath()+"/")
		flag := strings.Contains(stat.Name(), filename)
		if flag {
			fileType, _ := service.GetFileType(s)
			item := map[string]any{"name": stat.Name(), "isFile": !stat.IsDir(), "size": stat.Size(), "modified": stat.ModTime(), "extension": filepath.Ext(stat.Name()), "path": newstr, "filetype": fileType}
			items = append(items, item)
		}

	}
	curItem["items"] = items
	OkWithDetailed(curItem, "", ctx)
}
func Copy(ctx iris.Context) {

	path := ctx.URLParam("path")
	if path == "." {
		FailWithMessage("该目录是根目录，请勿复制", ctx)
		return
	}
	absPath := filepath.Join(getMyRootPath(), path)

	renamePath := service.RenamePath(absPath)
	if renamePath == "" {
		renamePath = absPath
	}
	if fileutil.IsDir(absPath) {
		err := service.CopyDir(absPath, renamePath)
		if err != nil {
			FailWithMessage("复制失败", ctx)
			return
		}
	} else {
		err := fileutil.CopyFile(absPath, renamePath)
		if err != nil {
			FailWithMessage("复制失败", ctx)
			return
		}
	}

	rel, _ := filepath.Rel(getMyRootPath(), filepath.Dir(absPath))
	d, _ := listFilesInnner(rel, ctx)
	OkWithDetailed(d, "", ctx)
}
