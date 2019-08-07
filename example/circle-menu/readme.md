CircleMenu  构造函数接受参数()

```
e.g.
实例化菜单
this.menu = new Utils.CircleMenu();

呼出菜单
this.menu.initMenu(event: Event, menu: MenuItem[], options: Options).then(({operation, argument}}) => {
   
});

interface MenuItem {
    name: string;
    icon: string;
    operation: string;
    argument: string;
    children: MenuItem[];
}

interface Options {
    intervalAngel: number; // 只能小于5      默认值： 0
    levelSpacing: number;  // 层级菜单间隔   默认值： 2
    cornerRadius: number;  // 菜单节点圆角   默认值： 3
    iconSize: number;      // 图标大小       默认值： 35
    fontSize: number;      // 字体大小       默认值： 12
    innerRadius: number;   // 内径           默认值： 50
    radiusStep: number;    // 菜单步长       默认值： 70
    fullCircle: boolean;   // 填充菜单       默认值： false
    arcLength: number      // 次级菜单弧长   默认值： 90,
    secondLength: number     // 二级菜单等分数量，设了该项则arcLength无效  默认值：null
}
```

ps: icon只支持使用svg sprite图标
