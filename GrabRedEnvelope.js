// 微信号：loisjee
// 欢迎添加微信交流更多脚本

"ui";
 
auto();
//线程，用于进行抢红包、停止抢红包
var _golThread;

//UI界面
function myUI(){
    ui.layout(
            <drawer id="drawer">
                <vertical>
                    <appbar>
                        <tabs id="tabs" />
                    </appbar>
                    <viewpager id="viewpager">
        
                        {/*
                           主页*/}
                        <frame>
                        <text w="auto" margin="10 50" color="#111111" size="18" text="本软件仅供学习交流使用，严禁用于非法用途！" />
                        <text w="auto" margin="10 80" color="#111111" size="18" text="更多有趣的软件，欢迎添加微信Loisjee交流。" />
        
                        <text w="auto" margin="10 120" color="#111111" size="18" text="使用本软件需要开启如下服务：" />
                        <card id="card4" w="*" h="100" margin="10 150" cardCornerRadius="2dp" cardElevation="1dp" foreground="?selectableItemBackground">
            
                                            <horizontal gravity="center_vertical">
                                                <View bg="#00BFFF" h="*" w="10" />
                                                <vertical padding="10 8" h="auto" w="0" layout_weight="1">
                                                <text w="auto" color="#111111" size="16" text="1、需要启动无障碍服务。" />
                                                <text w="auto" color="#111111" size="16" text="2、允许app显示在其他应用的上层。" />
                                                </vertical>   
                                                
                                            </horizontal>
                                        </card>

                        <button id="btnStart" text="开始抢红包" w="100" h="50" margin="150 300"/>
                        </frame>
        
        
                        {/*
                            About */}
                        <frame>
                            <vertical h="100dp" marginTop="200">
                            <text w="auto" color="#111111" layout_gravity="center" size="18" text="Version:  1.0.0" />
                            <text w="auto" layout_gravity="center" color="#111111" size="18" text="Author:  Loisjee" />
                            <text w="auto" layout_gravity="center" color="#111111" size="18" text="wechat:  Loisjee" />

                            <text w="auto" layout_gravity="center" color="#111111" size="18" text="欢迎微信交流" />
                            </vertical>

                        </frame>
                    </viewpager>
                </vertical>
                <vertical layout_gravity="left" bg="#ffffff" w="280">
                    <img w="280" h="200" scaleType="fitXY" />
                    <list id="menu">
                        <horizontal bg="?selectableItemBackground" w="*">
                            <img w="50" h="50" padding="16" src="{{this.icon}}" tint="{{color}}" />
                            <text textColor="black" textSize="15sp" text="{{this.title}}" layout_gravity="center" />
                        </horizontal>
                    </list>
                </vertical>
            </drawer>
        );
        
        //设置滑动页面的标题
        ui.viewpager.setTitles(["主页", "About"]);
        //让滑动页面和标签栏联动
        ui.tabs.setupWithViewPager(ui.viewpager);
}
myUI();
/**
 * 启动程序
 */
ui.btnStart.on("click", () => {
    var status = ui.btnStart.getText();
    if(status == "开始抢红包"){
        ui.btnStart.setText("结束抢红包");
        _golThread = threads.start(function () {
            log("Start日志");
            Main();
            toast("程序开始运行，请打开微信");
        });
    }
    else{
        if (_golThread && _golThread.isAlive()) {
            log("线程" + _golThread.isAlive());
            _golThread.interrupt();
            ui.btnStart.setText("开始抢红包");
            console.log("本次运行结束");
            console.log("-----------");

        }
    }

});


function judgeActivity(){
    if(currentPackage() != "com.tencent.mm"){
        console.log("等待进入微信界面...");
        waitForPackage("com.tencent.mm");
        console.log("已进入微信，等待进入聊天页面...");
    }
    if(judgeChat() == false){
        while(judgeChat() == false){
            console.log("等待进入聊天页面");
        }
        console.log("已进入聊天页面，开始抢红包");
        console.log("-----------------------");
    }
    
}

function judgeChat(){
    if(desc("更多功能按钮，已折叠").findOnce() == null){
        return false;
    }
    return true;
}
/**
 * 主入口程序
 */
function Main() {
    console.show();
    judgeActivity();

    // while(id("ax7").findOnce())
    requestScreenCapture(false);
    // 红包控件
    var redEnvelopes = id("auf");
    var redEnvelopes_x = 0;
    var redEnvelopes_y = 0;

    while(true){
        judgeActivity();
        if(redEnvelopes.exists()){
            // 找出所有红包
            redEnvelopes_point = id("auf").find();
            if(redEnvelopes_point.length > 0){
                // 找出最新的红包
                redEnvelopes_x = redEnvelopes_point[redEnvelopes_point.length - 1].bounds().centerX();
                redEnvelopes_y = redEnvelopes_point[redEnvelopes_point.length - 1].bounds().centerY();
                var img = captureScreen();
                var color = images.pixel(img, redEnvelopes_x, redEnvelopes_y);
                var point = findColor(img, "#FA9D3B", {
                    region: [redEnvelopes_x, redEnvelopes_y, 50, 50],
                    threshold: 4
                });
                // 通过颜色判断该红包是否已领取
                if(point){
                    console.log("------发现新红包------");
                    click(redEnvelopes_x, redEnvelopes_y);
                    sleep(1000);
                    openBox();
                    sleep(1000);
                }
                else{
                    console.log("暂未发现新红包");
                }
            }else{
                //当前界面没有红包 不作任何处理
                console.log("暂未发现新红包");
            }
    
      }
      else{
        console.log("暂未发现新红包");
      }
    }
}

function openBox(){
    console.log("尝试打开新红包")
    var open = id("f4f");
    // 判断控件“开”是否存在
    if(open.exists()){ 
        open.findOne().click();
        console.log("成功领取一个新红包!!!");
        console.log("----------------------------------------------")
        sleep(2000);
        console.log("返回");
    }else{
        console.log("红包已领取或过期")
        sleep(1000)
    }
    back();
}
     

