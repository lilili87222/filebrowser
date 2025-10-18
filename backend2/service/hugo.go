package service

import (
	"go.uber.org/zap"
	"os"
	"os/exec"
	"path/filepath"
)

// var comment string
//
//	func init() {
//		comment = "./hugo"
//		if os.Getenv("GOOS") == "windows" {
//			comment += ".exe"
//		}
//	}
func CreateSite(sitename, abspath string) error {

	setdir := filepath.Join(abspath, sitename)
	err := os.Mkdir(setdir, 0755)
	if err != nil {
		return err
	}
	err = Unzip("runtime/site.zip", setdir)
	if err != nil {
		return err
	}
	return nil

}

func BuildSite(absPath string, flag bool) error {
	// 判断是否是md文件
	siteRootPath := absPath
	if flag {
		//md文件路径有无content
		filePath := filepath.Dir(absPath) // 给定的文件地址
		for {
			dir := filepath.Dir(filePath) // 获取上级目录
			if dir == "." {               // 已经到达文件系统根目录
				return nil
			}
			configFile := filepath.Join(dir, "config.toml") // 拼接配置文件路径
			if _, err := os.Stat(configFile); err == nil {
				siteRootPath = dir
				break // 找到配置文件后跳出循环
			}
			filePath = dir // 继续向上一级目录查找
		}
	}
	hugoCommand := exec.Command("./runtime/hugo", "--source", siteRootPath)
	data, err := hugoCommand.CombinedOutput()
	zap.L().Info("hugo命令执行结果", zap.String("result", string(data)))
	if err != nil {
		zap.L().Error("命令执行失败", zap.Error(err))
		return err
	} else {
		return nil
	}
}
