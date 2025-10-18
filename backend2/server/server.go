package service

import (
	"filebrowser/utils"
	"fmt"
	"github.com/kataras/iris/v12"
	"github.com/spf13/viper"
	"go.uber.org/zap"
	"os"
	"path/filepath"
)

func Start() {
	loadConfig()
	configLogger()
	startService(viper.GetString("server.port"))
}
func configLogger() {
	err := utils.InitLogger()
	if err != nil {
		fmt.Printf("init logger failed, err:%v\n", err)
	}

}
func loadConfig() {
	executablePath, err1 := os.Executable()
	if err1 != nil {
		zap.L().Fatal("加载配置文件出错，请检查是否有配置文件。", zap.Error(err1))
	}
	executableDir := filepath.Dir(executablePath)
	// 获取目录对应的路径
	viper.SetConfigName("application.yaml")         // 配置文件名
	viper.SetConfigType("yaml")                     // 配置文件类型
	viper.AddConfigPath(executableDir + "/runtime") // 执行go run 对应的路径配置
	viper.AddConfigPath("./runtime")                // 执行go run 对应的路径配置
	err := viper.ReadInConfig()
	if err != nil {
		zap.L().Fatal("读取配置文件出错", zap.Error(err))
	}
}
func startService(port string) {
	fmt.Println("http://localhost:" + port)

	_, err := os.Stat(viper.GetString("filebrowser.home"))
	if os.IsNotExist(err) {
		err = os.Mkdir(viper.GetString("filebrowser.home"), 0755)
		if err != nil {
			zap.L().Error("创建目录出错", zap.Error(err))
		}
	}

	app := iris.Default()
	app.Logger().SetLevel("info")
	eee := app.I18n.Load("./runtime/locales/*/*", "en-US", "zh-CN")
	if eee != nil {
		zap.L().Fatal("加载国际化内容错误，查看是否存在资源。", zap.Error(eee))
	}
	registerRoutes(app)
	//zap.L().Info("监听端口", zap.String("start server port", port))
	app.Listen(":"+port, iris.WithoutPathCorrectionRedirection)

}
