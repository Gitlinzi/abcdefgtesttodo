### 安装依赖
> npm install

### 手动编译less文件
> gulp less

### 监视文件变化并自动编译
> gulp watch
> gulp


### 开启开发模式（css不会被压缩）
> gulp watch -c b2c


### 使用线上环境

> gulp -c laiyifen -e env/online.properties
> gulp -c laiyifen

### 线上服务

> npm run laiyifen-online