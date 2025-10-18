package service

import (
	//"github.com/iris-contrib/swagger/v12"
	//"github.com/iris-contrib/swagger/v12/swaggerFiles"
	//_ "github.com/swaggo/swag"
	//_ "filebrowser/docs"
	//"github.com/kataras/iris/v12"

	"github.com/kataras/iris/v12"
)

//func configurationApiSwag(app *iris.Application) {
//	swaggerUI := swagger.WrapHandler(swaggerFiles.Handler, swagger.URL("/swagger/doc.json"), // The url pointing to API definition.
//		swagger.DeepLinking(true))
//	app.Get("/swagger", swaggerUI)
//	// And the wildcard one for device.html, *.js, *.css and e.t.c.
//	app.Get("/swagger/{any:path}", swaggerUI)
//	app.Get("/swag", func(ctx iris.Context) {
//		ctx.Redirect("/swagger/index.html")
//	})
//}

func configurationApiSwag(app *iris.Application) {

}
