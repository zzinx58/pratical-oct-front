<template>
  <!-- <div class="painting-actionbar">
  </div> -->
  <div class="canvas-page-container">
    <canvas id="canvas" class="canvas"></canvas>
    <div class="canvas-toolbar">
      <ElButton>
        <IEpEditPen />
        画笔
      </ElButton>
      <ElButton>
        <IFluentEraser20Regular />
        橡皮擦
      </ElButton>
      <ElButton>
        <div class="diagonal-line"></div>
        直线</ElButton
      >
      <ElButton>
        <IIcOutlineRectangle />
        矩形</ElButton
      >
      <ElButton>
        <div class="icon-circle"></div>
        圆形</ElButton
      >
      <ElButton>
        <IIcBaselineFormatSize />
        笔刷大小</ElButton
      >
      <ElButton>
        <IIcOutlinePalette />
        笔刷颜色</ElButton
      >
      <ElButton>
        <IEpPrinter />
        打印
      </ElButton>
      <ElButton>
        <IIcRoundSave />
        保存
      </ElButton>
      <ElButton>
        <IEpDelete />
        清除画布
      </ElButton>

      <ElButton><IEpRefreshLeft />上一步</ElButton>
      <ElButton>
        <IEpRefreshRight />
        下一步</ElButton
      >
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, nextTick, onMounted } from "vue";
import { fabric } from "fabric";
import canvasStyles from "@/styles/canvas.module.scss";
export default defineComponent({
  name: "DrawPainting",
  setup() {
    var canvas;
    const canvasWidth =
      window.innerWidth - (canvasStyles.canvasToolsBarWidth as any);
    const canvasHeight =
      window.innerHeight - (canvasStyles.headerHeight as any);
    // console.log(canvasWidth, canvasHeight );
    // console.log(canvasStyles.canvasToolsBarWidth, canvasStyles.headerHeight);

    onMounted(() => {
      // nextTick(() => {
      canvas = new fabric.Canvas("canvas", {
        width: canvasWidth,
        height: canvasHeight,
      });
      canvas.backgroundColor = "#111827";
      var rect = new fabric.Rect({
        left: 100,
        top: 100,
        fill: "red",
        width: 20,
        height: 20,
      });
      canvas.add(rect);
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush = new fabric.PencilBrush(canvas);
      canvas.freeDrawingBrush.color = "white";
      canvas.freeDrawingBrush.width = 4;
    });
    // })
    return {
      canvas,
    };
  },
});
</script>

<style scoped lang="scss">
.icon-circle {
  width: 15px;
  height: 15px;
  border: 1.5px solid #000000;
  border-radius: 20px;
}
.diagonal-line {
  width: 12px;
  height: 12px;
  background: linear-gradient(
    -45deg,
    transparent 49.5%,
    #000000 49.5%,
    #000000 50.5%,
    transparent 60%
  );
}

.canvas-page-container {
  @apply flex;
  .canvas {
    @apply flex-1;
  }
  .canvas-toolbar {
    @apply flex-1 flex flex-col;
    @apply bg-teal-400;
  }
}
#canvas {
}
</style>
