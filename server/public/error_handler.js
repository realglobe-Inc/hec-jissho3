(function () {
  // エラーアラートは一度のみ
  var throwed = false

  var handleError = function (err) {
    if (!throwed) {
      throwed = true
      window.alert('予期せぬエラーが発生しました:')
      if (err) {
        console.error(err.message)
        console.error(err.filename)
        console.error(err.lineno)
      }
    }
  }

  window.addEventListener('error', handleError)

  var onUnhandled = window.onunhandledrejection
  window.onunhandledrejection = function (rejection) {
    onUnhandled && onUnhandled(rejection)
    handleError()
  }
})()
