import { app, BrowserWindow } from 'electron'
import path from 'path'

// 屏蔽安全警告
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  // 判断开发环境还是生产环境
  if (process.env.VITE_DEV_SERVER_URL) {
    // 开发模式：加载 Vite 开发服务器地址
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    // 开启调试工具
    win.webContents.openDevTools()
  } else {
    // 生产模式：加载打包后的 html 文件
    win.loadFile(path.join(__dirname, '../dist/index.html'))
  }
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})