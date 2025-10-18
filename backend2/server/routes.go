package service

import (
	"filebrowser/controller"
	"filebrowser/middleware"
	"github.com/kataras/iris/v12"
	"github.com/kataras/iris/v12/sessions"
	"github.com/spf13/viper"
)

func registerMiddleWare(app *iris.Application) {
	sess := sessions.New(sessions.Config{Cookie: "sessionid"})
	app.Use(sess.Handler())
	//app.Use(recover.New())
	//app.Use(middleware.IrisLogger)
	app.Use(middleware.IrisRecovery(true))
	app.Use(middleware.Cors)
	app.Use(middleware.IsLogin)

}

func registerRoutes(app *iris.Application) {

	//viewEngine := iris.HTML("./www/template", ".html") //.Layout("zh/layout.html")
	//viewEngine := iris.Blocks("./www/template", ".html").Reload(true) // TIP: append .Reload(true) to reload the templates on each request.
	//app.RegisterView(viewEngine)
	registerMiddleWare(app)
	//app.HandleDir("/statics/", "www/statics/")
	configurationApiSwag(app)
	//app.Favicon("www/statics/favicon.ico")
	//app.Get("/", func(context *context.Context) {
	//	context.Redirect("/editor/")
	//})
	//app.Get("/error.html", controller.Error)
	app.OnErrorCode(404, func(ctx iris.Context) {
		ctx.HTML("<div style=\"height:100vh;\">\n\n\t<div class=\"d-flex flex-column align-items-center justify-content-center h-100\">\n\t\t<h1 class=\"display-1 text-muted\">Oops!</h1>\n\t\t<p class=\"lead\">Error 404. The page you requested could not be found.</p>\n\t\t<a href=\"/\" class=\"btn btn-outline-primary mt-5\">\n\t\t\t<i class=\"fas fa-arrow-left\"></i>\n\t\t\tReturn to the homepage\n\t\t</a>\n\t</div>\n</div>\n")
	})

	app.Get("/topic/appuploader/{doc}", func(ctx iris.Context) {
		ctx.Redirect("https://www.applicationloader.net/doc/")
	})
	app.HandleDir("/editor/", viper.GetString("server.editor"), iris.DirOptions{
		IndexName: "index.html",
		ShowList:  false,
	})

	app.HandleDir(viper.GetString("server.preview.url"), viper.GetString("server.preview.location"), iris.DirOptions{
		IndexName: "index.html",
		ShowList:  false,
	})

	//app.Get("/images/{file}", controller.ShowMdImg)
	app.Get("/home/{file:path}", controller.ReadHomeFile)
	app.Get("/preview", controller.PreviewSite)

	user := app.Party("/user")
	{
		user.Post("/login", controller.UserLogin)
		user.Get("/userinfo", middleware.IsLogin, controller.UserInfo)
		user.Post("/logout", controller.LoginOut)
	}
	file := app.Party("/file")
	{
		//file.Get("/images/{name}", controller.ShowImg)
		file.Get("/list", controller.ListFiles)
		file.Post("/move", controller.MoveFile)
		file.Post("/delete", controller.DeleteFile)
		file.Post("/upload", controller.UploadFile)
		file.Post("/upload_dir", controller.UploadDir)
		file.Post("/upload_md", controller.UploadMdFile)
		file.Post("/download", controller.DownloadFile)
		file.Post("/rename", controller.RenameFile)
		file.Post("/create", controller.CreateFile)
		file.Post("/new_mdfile", controller.NewMdFile)
		file.Post("/mkdir", controller.CreateFolder)
		file.Get("/read", controller.ReadFile)
		file.Post("/save", controller.SaveFile)
		file.Get("/unzip", controller.Unzip)
		file.Get("/preview", controller.PreviewFile)
		file.Get("/move/{action}", controller.MoveAction)
		file.Get("/search", controller.Search)
		file.Post("/copy", controller.Copy)

	}
	hugo := app.Party("/hugo")
	{
		hugo.Get("/create", controller.CreateSite)
		hugo.Get("/build", controller.BuildSite)

	}
}
