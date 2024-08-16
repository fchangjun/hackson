module.exports = {
  plugins: {
    'postcss-px-to-viewport': {
      viewportWidth: 1242,  // 设计稿宽度
      viewportHeight: 2688, // 设计稿高度（可选）
      unitPrecision: 3,    // px 转换为视窗单位的小数位数
      viewportUnit: 'vw',  // 使用的视窗单位
      selectorBlackList: ['.ignore', '.hairlines'], // 需要忽略的CSS选择器
      minPixelValue: 1,    // 小于或等于 1px 不转换为视窗单位
      mediaQuery: false    // 允许在媒体查询中转换px
    }
  }
}