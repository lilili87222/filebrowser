package middleware

import (
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/sessions"
	"net/http"
	"strings"
)

func IsLogin(ctx iris.Context) {
	sess := sessions.Get(ctx)
	rpath := ctx.Path()
	//fmt.Printf("%v", ctx.Params())
	if strings.HasPrefix(rpath, "/editor") {
		ctx.Next()
		return
	}
	if strings.HasPrefix(rpath, "/sites") {
		ctx.Next()
		return
	}
	if strings.HasPrefix(rpath, "/user/login") {
		ctx.Next()
		return
	}
	if sess.GetString("username") == "" {
		if strings.HasPrefix(rpath, "/user") || strings.HasPrefix(rpath, "/file") || strings.HasPrefix(rpath, "/hugo") {
			ctx.StopWithStatus(http.StatusUnauthorized)
			return
		}
	}
	ctx.Next()
	return

	//whitelist := []string{"/user/login", "/", "/user/logout"}
	//if slices.Contains(whitelist, rpath) || sess.GetString("username") != "" {
	//	ctx.Next()
	//	return
	//}
	//ctx.StopWithStatus(http.StatusUnauthorized)
	//if sess.GetString("username") == "" {
	//	ctx.StopWithStatus(http.StatusUnauthorized)
	//	return
	//}
	////ctx.Values().Set("username", sess.GetString("username"))
	//ctx.Next()
}
