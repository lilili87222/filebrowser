package controller

import (
	"filebrowser/service"
	"github.com/kataras/iris/v12"
	"go.uber.org/zap"
	"os"
	"path/filepath"
)

// @Summary 初始化站点目录
// @Description   初始化站点目录
// @Param path query  string true "文件夹路径path"
// @Param name query  string true "站点名字site_name"
// @Router /hugo/create [get]

func CreateSite(ctx iris.Context) {
	sitename := ctx.URLParam("site_name")
	path := ctx.URLParam("path")
	absPath := filepath.Join(getMyRootPath(), path)
	pathInfo, err := os.Stat(absPath)
	if err != nil {
		zap.L().Error("请求路径地址出错", zap.Error(err))
		FailWithMessage("请确定路径正确", ctx)
	}
	if !pathInfo.IsDir() {
		absPath = filepath.Dir(absPath)
		path = filepath.Dir(path)
	}
	err = service.CreateSite(sitename, absPath)
	if err != nil {
		zap.L().Error("创建站点出错", zap.Error(err))
		FailWithMessage("初始化失败,查看是否有重名站点", ctx)
		return
	}

	//刷新
	d, _ := listFilesInnner(path, ctx)
	OkWithDetailed(d, "", ctx)
}

// @Summary 生成站点
// @Description   生成站点
// @Param path query  string true "文件夹路径path"
// @Router /hugo/build [get]
func BuildSite(ctx iris.Context) {

	path := ctx.URLParam("path")

	absPath := filepath.Join(getMyRootPath(), path)
	if filepath.Ext(absPath) != "" {
		absPath = filepath.Dir(absPath)
	}

	contentPath := filepath.Join(absPath, "/content")

	contentPath = filepath.ToSlash(contentPath)
	_, err := os.Stat(filepath.Join(absPath, "config.toml"))
	_, err1 := os.Stat(contentPath)
	if err != nil || err1 != nil {
		FailWithMessage("该目录不是站点目录", ctx)
		return
	}
	err = service.BuildSite(absPath, false)
	if err != nil {
		zap.L().Error("构建站点出错", zap.Error(err))
		FailWithMessage("请正确书写配置文件和MD文件或确定功能正常", ctx)
		return
	}
	OkWithMessage("构建站点成功", ctx)

}
