# GrabRedEnvelope
安卓平台微信自动抢红包小脚本，脚本使用autojs开发，可以用自动对某聊天框（群聊、好友）进行红包持续监测，发现红包自动进行打开。



该工具不会无任何病毒（由于是个人编写，安装时会系统会进行警告），请放心使用。请给个 **Star** 吧，非常感谢！ 



# 开发环境

## autojs

autojs开发：版本号4.1.1 Alpha2

autojs打包插件：版本号4.1.1 Alpha2

版本号不一定需要一样，只要可以进行开发即可。

## VSCode

vscode用于网页端代码编写，自行下载即可。



# 代码逻辑

代码逻辑较为简单，主要通过持续监测当前聊天框是否有红包出现，监测方式为通过红包控件的id，如果出现红包控件，则判断该红包是否已领取；如未领取则对其进行点击，点击后如果出现新红包（通过新红包中间的“开”控件来判断），则对其进行点击领取；领取成功后返回。



# 打包软件

脚本已经打包好测试可以，[下载地址](https://wws.lanzous.com/i3XPJlmvjsb ), 密码:8tv2  ,欢饮大家下载试用。