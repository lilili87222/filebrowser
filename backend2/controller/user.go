package controller

import (
	"fmt"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/sessions"
	"github.com/spf13/viper"
	"net/http"
	"strings"
)

var (
// sess = sessions.New(sessions.Config{Cookie: "sessionid", Expires: 720 * time.Hour})
)

// @Summary 登录
// @Description   登录账号
// @Param username formData string true "用户名"
// @Param password formData string true "密码"
// @Produce  json
// @Success 200 {json} string	"success"
// @Router /user/login [post]
func UserLogin(ctx iris.Context) { //TODO session存储为用户的id  以及登录时的次数刷新使用数据库

	username := strings.TrimSpace(ctx.FormValue("username"))
	password := strings.TrimSpace(ctx.FormValue("password"))
	if username == strings.TrimSpace(viper.GetString("filebrowser.username")) && password == strings.TrimSpace(viper.GetString("filebrowser.password")) {
		//sessmanager := sess.Start(ctx, iris.CookieHTTPOnly(false), iris.CookieAllowSubdomains(".localhost:9999"))
		//sessmanager.Set("username", username)
		session := sessions.Get(ctx)
		session.Set("username", username)
		OkWithMessage("登录成功", ctx)
	} else {
		FailWithMessage("用户名或密码错误", ctx)
	}
}

// @Summary 用户信息
// @Description   获取用户信息
// @Produce  json
// @Success 200 {json} string	"success"
// @Router /user/userinfo [Get]
func UserInfo(ctx iris.Context) {
	//获取请求参数
	username := ctx.Values().GetString("username")
	fmt.Printf(username)
	//查询信息
	ctx.StopWithJSON(http.StatusOK, "success")
}

// @Summary 退出
// @Description   退出登录
// @Success 200 {json} string	"success"
// @Router /user/loginout [Get]
func LoginOut(ctx iris.Context) {
	//sess.Start(ctx).Destroy()
	sessions.Get(ctx).Destroy()
	OkWithMessage("", ctx)
}
