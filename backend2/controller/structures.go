package controller

import (
	"github.com/kataras/iris/v12"
	"net/http"
)

type Response struct {
	Code int         `json:"code"`
	Data interface{} `json:"data"`
	Msg  string      `json:"msg"`
}

const (
	ERROR   = 500
	SUCCESS = 200
)

func Result(code int, data interface{}, msg string, c iris.Context) {
	// 开始时间
	c.StopWithJSON(http.StatusOK, Response{
		code,
		data,
		msg,
	})
}

func Ok(c iris.Context) {
	Result(SUCCESS, map[string]interface{}{}, "操作成功", c)
}

func OkWithMessage(message string, c iris.Context) {
	Result(SUCCESS, map[string]interface{}{}, message, c)
}

func OkWithData(data interface{}, c iris.Context) {
	Result(SUCCESS, data, "查询成功", c)
}

func OkWithDetailed(data interface{}, message string, c iris.Context) {
	Result(SUCCESS, data, message, c)

}

func Fail(c iris.Context) {
	Result(ERROR, map[string]interface{}{}, "操作失败", c)
}

func FailWithMessage(message string, c iris.Context) {
	Result(ERROR, map[string]interface{}{}, message, c)
}

func FailWithDetailed(data interface{}, message string, c iris.Context) {
	Result(ERROR, data, message, c)
}
