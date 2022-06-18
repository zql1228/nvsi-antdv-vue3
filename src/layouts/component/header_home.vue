<template>
  <div class="header_home">
    <div class="header_home_span1">早安，祝你开心每一天！</div>
    <div class="header_home_span2">乔峰市元宝山区医务社工红十字爱老志愿服务队</div>
    <div class="layout_header_bottom_right">
      <a-row>
        <a-col span="8" class="text_right before">
          <a-row>
            <a-col span="24" class="span1">
              <span>进行中的服务</span>
            </a-col>
            <a-col span="24" class="span2">
              <span>56</span>
            </a-col>
          </a-row>
        </a-col>
        <a-col span="8" class="text_right before">
          <a-row>
            <a-col span="24" class="span1">
              <span>任职社工</span>
            </a-col>
            <a-col span="24" class="span2">
              <span>8</span>
              <span class="span3">&nbsp;/&nbsp;</span>
              <span class="span3">24</span>
            </a-col>
          </a-row>
        </a-col>
        <a-col span="8" class="text_right">
          <a-row>
            <a-col span="24" class="span1">通知公告</a-col>
            <a-col span="24" class="span2">2,223</a-col>
          </a-row>
        </a-col>
      </a-row>
    </div>
  </div>
</template>
<style scoped>
.before::before{
  content: '';
  display: inline-block;
  width: 1px;
  height: 40px;
  background: #e9e9e9;
  position: absolute;
  right: -31px;
  top: 50%;
  transform: translateY(-50%);
}
.header_home {
  position: relative;
  padding-left: 24px;
  background: #fff;
  height: 90px;
}
.header_home_span1 {
  font-size: 20px;
  color: #000;
  line-height: 28px;
  padding-top: 11px;
  padding-bottom: 12px;
  box-sizing: border-box;
}
.header_home_span2 {
  font-size: 16px;
  color: #666;
  line-height: 22px;
}
.layout_header_bottom_right {
  position: absolute;
  height: 68px;
  right: 32px;
  top: -4px;
  box-sizing: border-box;
}
.text_right {
  text-align: right;
  position: relative;
}
.span1 {
  font-size: 14px;
  color: #666;
  line-height: 22px;
}
.span2 {
  font-size: 30px;
  color: #000;
  line-height: 38px;
}
.span3 {
  font-size: 20px;
  color: #666;
  line-height: 28px;
}
</style>