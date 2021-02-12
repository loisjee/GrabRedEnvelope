// 微信号：loisjee
// 欢迎添加微信交流更多脚本

"ui";
 
auto();
// 线程，用于进行抢红包、停止抢红包
var _golThread;
// 红包个数，用于计数
var total = 0;
// UI界面
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
                            <text w="auto" color="#111111" layout_gravity="center" size="18" text="Version:  1.0.1" />
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
    var redEnvelopes = text("微信红包");
    var redEnvelopes_x = 0;
    var redEnvelopes_y = 0;
    
    while(true){
        judgeActivity();
        if(redEnvelopes.exists()){
            // 找出所有红包
            redEnvelopes_point =  text("微信红包").find();
            for(var i = 0;i<redEnvelopes_point.length;++i){
                // 判断该控件是否是红包控件

                if(redEnvelopes_point[i].className() != "android.widget.TextView"){
                    continue;
                }

                // text("已被领完").boundsInside()

                var left = redEnvelopes_point[i].bounds().left;
                var top = redEnvelopes_point[i].bounds().top - 250;
                var right = redEnvelopes_point[i].bounds().left + 800;
                var bottom = redEnvelopes_point[i].bounds().bottom;
                var yiLingQu = text("已领取").boundsInside(left, top, right, bottom).findOnce();
                var yiBeiLingWan = text("已被领完").boundsInside(left, top, right, bottom).findOnce();
                // 未领取且未被领完
                if(yiLingQu == null && yiBeiLingWan == null){
                    // 该红包未领取
                    redEnvelopes_x = redEnvelopes_point[i].bounds().centerX();
                    redEnvelopes_y = redEnvelopes_point[i].bounds().centerY();
                    console.log("------发现新红包------");
                    click(redEnvelopes_x, redEnvelopes_y);
                    sleep(1500);
                    openBox();
                    sleep(1000);
                }
                else{
                    console.log("当前红包已领取，等待新红包")
                }
            }
    
      }
      else{
        console.log("暂未发现新红包");
      }
    }
}

function openBox(){
    console.log("尝试打开新红包")
    var open = desc("开");
    // 判断控件“开”是否存在
    if(open.exists()){ 
        open.findOne().click();
        console.log("成功领取一个新红包!!!");
        console.log("-----------------------------------")
        sleep(1000);
        total++;
        console.log("----目前共领取" + total + "个-----")
        console.log("返回");
    }else{
        console.log("红包已领取或过期")
        sleep(1000)
    }
    back();
}
     