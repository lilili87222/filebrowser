package controller

import (
	"bufio"
	"filebrowser/service"
	"fmt"
	"github.com/kataras/iris/v12"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"net/url"
	"os"
	"path/filepath"
	"strings"
)

// @Param path query  string true "文件路径"
// @Router /home/{file} [get]
func ReadHomeFile(ctx iris.Context) {
	file := ctx.Params().Get("file")
	absPath, _ := filepath.Abs(filepath.Join(getMyRootPath(), file))
	if ctx.URLParam("fmt") == "editor" {
		ctx.ServeFile(viper.GetString("server.editor") + "editormd/index.html")
	} else if ctx.URLParam("fmt") == "json" {
		content, e := os.ReadFile(absPath)
		if e != nil {
			zap.L().Error("读取资源文件失败", zap.Error(e))
			FailWithMessage("该文件不存在或权限不足，请刷新重试", ctx)
			return
		} else {
			OkWithDetailed(string(content), "", ctx)
			return
		}
	} else {
		ctx.ServeFile(absPath)
	}

}

func PreviewSite(ctx iris.Context) {
	path := ctx.URLParam("path")
	host := ctx.Host()

	absPath := filepath.Join(getMyRootPath(), path)
	filePath := filepath.Dir(absPath) // 给定的文件地址

	err1 := service.BuildSite(absPath, true)
	if err1 != nil {
		zap.L().Error("构建站点出错", zap.Error(err1))
		FailWithMessage("请正确书写配置文件和MD文件或确定功能正常", ctx)
		return
	}
	var configFilePath string
	//找配置文件
	for {
		dir := filepath.Dir(filePath) // 获取上级目录
		if dir == "." {               // 已经到达文件系统根目录
			break
		}
		configFile := filepath.Join(dir, "config.toml") // 拼接配置文件路径
		if _, err := os.Stat(configFile); err == nil {
			configFilePath = configFile
			break // 找到配置文件后跳出循环
		}
		filePath = dir // 继续向上一级目录查找
	}

	contentPath := filepath.Join(filepath.Dir(configFilePath), "content")
	_, err := os.Stat(contentPath)
	//确定是站点
	if configFilePath != "" && err == nil {
		//读配置文件
		result, _ := readConfig(configFilePath)
		//读md文件
		//mdresult, _ := readMdfile(absPath)
		//if mdresult == "" {
		//	FailWithMessage("该文件未编写内容或未正确按照该主题要求书写MD文件", ctx)
		//	return
		//}
		s := fmt.Sprintf("%s%s", filepath.Dir(configFilePath), "/content")
		rel, _ := filepath.Rel(s, absPath)
		//判断主页md
		if rel == "_index.md" {
			rel = ""
		}

		if filepath.Base(rel) == "_index.md" {
			rel = filepath.ToSlash(rel)
			rel = strings.Replace(rel, "/_index.md", "", 1)
			if strings.HasPrefix(result, "http://") {
				parse, _ := url.Parse(result)
				result = parse.Path
			}
			sitePath := fmt.Sprintf("%s%s%s", "http://", filepath.Join(host, result, rel), ".html")
			sitePath = strings.ReplaceAll(sitePath, " ", "-")
			OkWithDetailed(sitePath, "", ctx)
			return
		} else {
			rel = strings.Replace(rel, ".md", ".html", 1)
			sitePath := fmt.Sprintf("%s%s", "http://", filepath.Join(host, result, rel))
			sitePath = strings.ReplaceAll(sitePath, " ", "-")
			OkWithDetailed(sitePath, "", ctx)
			return
		}

	}

	//拼接

	FailWithMessage("该文件不是站点文章", ctx)
}

func readConfig(configPath string) (string, error) {
	var result string
	file, _ := os.Open(configPath)    // 打开配置文件
	defer file.Close()                // 确保在函数返回时关闭文件
	scanner := bufio.NewScanner(file) // 创建扫描器

	for scanner.Scan() { // 逐行读取文件
		line := scanner.Text()
		if strings.HasPrefix(line, "#") { // 忽略注释行
			continue
		}
		parts := strings.Split(line, "=")
		if len(parts) != 2 { // 跳过无效行
			continue
		}
		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		// 处理读取到的键值对
		if key == "baseURL" && value != "" {
			value = strings.Trim(value, "'")
			result = value
			break
		}
	}
	if err := scanner.Err(); err != nil { // 检查是否有错误发生
		return "", err
	}
	return result, nil
}

//
//func readMdfile(mdpath string) (string, error) {
//	var mdresult string
//	mdfile, _ := os.Open(mdpath)          // 打开配置文件
//	defer mdfile.Close()                  // 确保在函数返回时关闭文件
//	mdscanner := bufio.NewScanner(mdfile) // 创建扫描器
//
//	for mdscanner.Scan() { // 逐行读取文件
//		line := mdscanner.Text()
//
//		if strings.HasPrefix(line, "linkTitle") {
//			fields := strings.FieldsFunc(line, func(r rune) bool {
//				return r == ':' || r == '='
//			})
//			if len(fields) > 1 && fields[1] != "" {
//				// 找到了 linktitle 的值
//				mdresult = fields[1]
//				break
//			}
//		}
//	}
//	if err := mdscanner.Err(); err != nil { // 检查是否有错误发生
//		return "", err
//	}
//	return mdresult, nil
//
//}

//if strings.Contains(filepath.Join(filepath.Dir(configFilePath), "content"), "content") {
//
//}

//}
//if result != "" {
//OkWithDetailed(result, "", ctx)
//return
//}
//FailWithMessage("该文件不是站点文件", ctx)
//return
