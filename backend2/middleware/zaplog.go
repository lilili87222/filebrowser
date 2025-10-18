package middleware

import (
	"filebrowser/utils"
	"github.com/kataras/iris/v12"
	"go.uber.org/zap"
	"net"
	"net/http/httputil"
	"os"
	"runtime/debug"
	"strings"
	"time"
)

// GinLogger 接收gin框架默认的日志
func IrisLogger(ctx iris.Context) {

	start := time.Now()
	path := ctx.Request().URL.Path
	query := ctx.Request().URL.RawQuery
	ctx.Next()

	cost := time.Since(start)
	utils.Lg.Info(path,
		zap.Int("status", ctx.GetStatusCode()),
		zap.String("method", ctx.Request().Method),
		zap.String("path", path),
		zap.String("query", query),
		zap.String("ip", ctx.RemoteAddr()),
		zap.String("user-agent", ctx.Request().UserAgent()),
		zap.Duration("cost", cost),
	)

}

// GinRecovery recover掉项目可能出现的panic，并使用zap记录相关日志
func IrisRecovery(stack bool) iris.Handler {
	return func(ctx iris.Context) {
		defer func() {
			if err := recover(); err != nil {
				// Check for a broken connection, as it is not really a
				// condition that warrants a panic stack trace.
				var brokenPipe bool
				if ne, ok := err.(*net.OpError); ok {
					if se, ok := ne.Err.(*os.SyscallError); ok {
						if strings.Contains(strings.ToLower(se.Error()), "broken pipe") || strings.Contains(strings.ToLower(se.Error()), "connection reset by peer") {
							brokenPipe = true
						}
					}
				}

				httpRequest, _ := httputil.DumpRequest(ctx.Request(), false)
				if brokenPipe {
					utils.Lg.Error(ctx.Request().URL.Path,
						zap.Any("error", err),
						zap.String("request", string(httpRequest)),
					)
					// If the connection is dead, we can't write a status to it.
					//ctx.Error(err.(error)) // nolint: errcheck
					ctx.Values().Set("Error", err)
					//ctx.Abort()
					ctx.StopExecution()
					return
				}

				if stack {
					utils.Lg.Error("[Recovery from panic]",
						zap.Any("error", err),
						zap.String("request", string(httpRequest)),
						zap.String("stack", string(debug.Stack())),
					)
				} else {
					utils.Lg.Error("[Recovery from panic]",
						zap.Any("error", err),
						zap.String("request", string(httpRequest)),
					)
				}
				//ctx.AbortWithStatus(http.StatusInternalServerError)
				ctx.StopWithStatus(iris.StatusInternalServerError)
			}
		}()
		ctx.Next()
	}

}
