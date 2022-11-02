<template>
  <!-- <div class="painting-actionbar">
  </div> -->
  <div class="canvas-page-container">
    <canvas id="canvas" class="canvas" ref="domCanvas"></canvas>
    <div class="canvas-toolbar">
      <div class="canvas-actions">
        <ElButton @click="toggleDrawLine">
          <div class="diagonal-line"></div>
          直线</ElButton
        >
        <ElButton @click="toggleDrawRect">
          <IIcOutlineRectangle />
          矩形</ElButton
        >
        <ElButton @click="toggleDrawCircle">
          <div class="icon-circle"></div>
          圆形</ElButton
        >
        <ElButton @click="togglePenDraw('pen')">
          <IEpEditPen />
          画笔
        </ElButton>
        <ElButton @click="toggleErasing">
          <IFluentEraser20Regular />
          橡皮擦
        </ElButton>
        <ElButton @click="changeToolSize">
          <IIcBaselineFormatSize />
          笔刷大小</ElButton
        >
        <ElButton @click="changeToolColor">
          <IIcOutlinePalette />
          笔刷颜色</ElButton
        >
        <ElButton type="danger" plain @click="clearCanvas">
          <IEpDelete />
          重置画布
        </ElButton>
        <ElButton @click="previousStep"><IEpRefreshLeft />上一步</ElButton>
        <ElButton @click="nextStep">
          <IEpRefreshRight />
          下一步</ElButton
        >
        <ElButton @click="toggleDownloadPainting">
          <IEpPrinter />
          存储本地
        </ElButton>
        <ElButton @click="toggleSaveAsPainting">
          <IIcRoundSave />
          存为作品
        </ElButton>
      </div>
      <div class="painting-actions">
        <div class="author-name"></div>
        Author: 19240134-zzx
      </div>
    </div>
  </div>

  <ElDialog v-model="dialogFormVisible_saveLoc" title="作品保存本地">
    <div class="flex whitespace-nowrap">
      <div class="items-center flex">文件名称：</div>
      <ElInput v-model="paintingName" placeholder="Please input" clearable />
    </div>
    <template #footer>
      <ElButton @click="dialogFormVisible_saveLoc = false">Cancel</ElButton>
      <ElButton type="primary" @click="downloadPicture">Confirm</ElButton>
    </template>
  </ElDialog>
  <ElDialog v-model="dialogFormVisible_saveClo" title="保存为作品">
    <div class="flex whitespace-nowrap flex-col">
      <div class="items-center flex">文件名称：</div>
      <ElInput v-model="paintingName" placeholder="Please input" clearable />
      <div>选择所属专辑:</div>
      <ElSelect v-model="selectedValue" placeholder="select ParentAlbum">
        <ElOption
          v-for="item in selectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
    </div>
    <template #footer>
      <ElButton @click="dialogFormVisible_saveClo = false">Cancel</ElButton>
      <ElButton type="primary" @click="SaveAsPainting">Confirm</ElButton>
    </template>
  </ElDialog>
</template>

<script lang="ts">
import { fabric } from "fabric";
import { saveAs } from "file-saver";
import canvasStyles from "@/styles/canvas.module.scss";
import { COS_Service } from "@/hooks/cos";
import { testStr } from "./Gallery.vue";
// import { Arrayable } from "element-plus/es/utils";
export default defineComponent({
  name: "DrawPainting",
  setup(props) {
    const dialogFormVisible_saveClo = ref(false);
    const selectedValue = ref("");
    const selectOptions = [{ value: "defaultAlbum", label: "defaultAlbum" }];
    const COSService = new COS_Service();
    const domCanvas = ref<HTMLCanvasElement | null>(null);
    const canvas = ref<fabric.Canvas>();
    const stateArray = <Array<string>>[];
    const stateIndex = ref<number>(0);
    const cBackgroundColor = ref<string>("#111827");
    const brush = ref<fabric.BaseBrush>();
    const toolColor = ref<string>("#eeeeee");
    const toolWidth = ref<number>(5);
    // const toolWidth = ref<Arrayable<number>>(4);
    const currentMode = ref<
      "eraser" | "pen" | "move" | "rect" | "line" | "circle"
    >("pen");
    const rect = ref<fabric.Rect>();
    const circle = ref<fabric.Circle>();
    const mouseFrom = reactive<{ x: number; y: number }>({ x: 0, y: 0 });
    const mouseTo = reactive<{ x: number; y: number }>({ x: 0, y: 0 });
    const paintingName = ref<string>("");
    const dialogFormVisible_saveLoc = ref(false);
    //canvas init
    const canvasWidth =
      window.innerWidth - (canvasStyles.canvasToolsBarWidth as any);
    const canvasHeight =
      window.innerHeight - (canvasStyles.headerHeight as any);

    //监听 Tool 颜色、大小变化

    const init = () => {
      //初始化画布
      canvas.value = new fabric.Canvas(domCanvas.value, {
        width: canvasWidth,
        height: canvasHeight,
        backgroundColor: cBackgroundColor.value,
      });
      // 禁止用户进行组选择
      canvas.value.selection = false;
      //初始化画布事件
      //监听鼠标按下后移动事件
      handleMouseMove();
      //初始化画笔
      // 设置自由绘画模式画笔类型为 铅笔类型
      brush.value = new fabric.PencilBrush(canvas.value);
      canvas.value.freeDrawingBrush = brush.value;
      // 设置自由绘画模式 初始的 画笔颜色与画笔线条大小
      canvas.value.freeDrawingBrush.color = toolColor.value;
      canvas.value.freeDrawingBrush.width = toolWidth.value;
      //默认启用画笔模式
      canvas.value.isDrawingMode = true;
      //记录初始状态
      saveSteps();
    };

    //监听鼠标按下事件
    const handleMouseMove = () => {
      //?why不能在函数外申明?因为dom还未挂载？值为undefined，所以报错了
      const canvasOffsetObject = domCanvas.value?.getBoundingClientRect();
      canvas.value?.on("mouse:down", (option) => {
        mouseFrom.x = option.e.clientX - canvasOffsetObject!.left;
        mouseFrom.y = option.e.clientY - canvasOffsetObject!.top;
        //some kind of important
        //logic and || operation
        if (
          currentMode.value !== "pen" ? currentMode.value !== "eraser" : false
        ) {
          canvas.value!.isDrawingMode = false;
        }
      });
      canvas.value?.on("mouse:up", (option) => {
        if (currentMode.value !== "move") {
          saveSteps();
        }
        mouseTo.x = option.e.clientX - canvasOffsetObject!.left;
        mouseTo.y = option.e.clientY - canvasOffsetObject!.top;
        switch (currentMode.value) {
          case "eraser":
            console.log(1);
            break;
          case "line":
            drawLine();
            break;
          case "rect":
            drawRect();
            break;
          case "circle":
            drawCircle();
            break;
          case "move":
            break;
        }
      });
    };

    //保存每步操作的内容
    const saveSteps = () => {
      console.log("save_index: [start:1]", stateIndex.value);
      stateIndex.value = stateIndex.value + 1;
      stateArray[stateIndex.value] = JSON.stringify(canvas.value);
    };

    //historyRecover
    const toggleHistoryRecover = (flag: number) => {
      let stateIdxTemp = stateIndex.value + flag;
      if (stateIdxTemp < 1) {
        console.log("out, the first step");
      }
      if (stateIdxTemp >= stateArray.length) {
        console.log("out,the last one");
      }
      if (stateArray[stateIdxTemp]) {
        canvas.value?.loadFromJSON(stateArray[stateIdxTemp], () => {
          console.log("preStepRecover");
        });
        if (canvas.value!.getObjects().length > 0) {
          canvas.value?.getObjects().forEach((item) => {
            item.set("selectable", false);
          });
        }
        stateIndex.value = stateIdxTemp;
      }
      console.log("cur_step:", stateIndex.value - 1);
    };
    //上一步
    const previousStep = () => {
      toggleHistoryRecover(-1);
    };
    //下一步
    const nextStep = () => {
      toggleHistoryRecover(1);
    };

    //触发画笔
    const togglePenDraw = (penLike: "pen" | "eraser") => {
      if (currentMode.value !== penLike) {
        currentMode.value = penLike;
        canvas.value!.isDrawingMode = true;
      } else {
        canvas.value!.isDrawingMode = false;
        currentMode.value = "move";
      }
    };

    //橡皮擦
    // @ts-ignore
    const toggleErasing = () => {
      togglePenDraw("eraser");
      //暂时使用颜色覆盖的方式解决问题
      canvas.value!.freeDrawingBrush.width = toolWidth.value;
      canvas.value!.freeDrawingBrush.color = cBackgroundColor.value;
    };

    //直线
    const toggleDrawLine = () => {
      if (currentMode.value !== "line") {
        currentMode.value = "line";
      } else {
        currentMode.value = "move";
      }
    };

    const drawLine = () => {
      const line = new fabric.Line(
        [mouseFrom.x, mouseFrom.y, mouseTo.x, mouseTo.y],
        {
          stroke: toolColor.value,
          strokeWidth: toolWidth.value,
        }
      );
      canvas.value?.add(line);
    };

    //矩形
    const toggleDrawRect = () => {
      if (currentMode.value !== "rect") {
        currentMode.value = "rect";
      } else {
        currentMode.value = "move";
      }
    };

    const drawRect = () => {
      rect.value = new fabric.Rect({
        left: Math.min(mouseFrom.x, mouseTo.x),
        top: Math.min(mouseFrom.y, mouseTo.y),
        width: Math.abs(mouseFrom.x - mouseTo.x),
        height: Math.abs(mouseFrom.y - mouseTo.y),
        // fill: toolColor.value,
        stroke: toolColor.value,
        strokeWidth: toolWidth.value,
      });
      canvas.value?.add(rect.value);
    };

    //圆形
    const toggleDrawCircle = () => {
      if (currentMode.value !== "circle") {
        currentMode.value = "circle";
      } else {
        currentMode.value = "move";
      }
    };

    const drawCircle = () => {
      const radius =
        Math.sqrt(
          Math.pow(mouseTo.x - mouseFrom.x, 2) +
            Math.pow(mouseTo.y - mouseFrom.y, 2)
        ) / 2;
      const posLeft = Math.min(mouseTo.x, mouseFrom.x);
      const posTop = Math.min(mouseTo.y, mouseFrom.y);
      circle.value = new fabric.Circle({
        radius: radius,
        left: posLeft,
        top: posTop,
        stroke: toolColor.value,
        strokeWidth: toolWidth.value,
      });
      canvas.value?.add(circle.value);
    };

    //画布重新绘制
    const clearCanvas = () => {
      // canvas.value?.clear();
      const childrens = canvas.value!.getObjects();
      if (childrens!.length > 0) canvas.value?.remove(...childrens);
      stateArray.length = 0;
    };

    // const ElInputVNode = h("ElInput");
    //画布导出为图片
    const toggleDownloadPainting = () => (dialogFormVisible_saveLoc.value = true);
    const downloadPicture = () => {
      dialogFormVisible_saveLoc.value = false;
      domCanvas.value?.toBlob((blob) => {
        //@ts-ignore
        saveAs(blob, paintingName.value + ".png");
      });
    };

    const toggleSaveAsPainting = () => (dialogFormVisible_saveClo.value = true)
    //将画作保存为作品
    const SaveAsPainting = () => {
      domCanvas.value?.toBlob(async (blob: any) => {
        const result = await COSService.uploadFile({
          Key: testStr + "/" + paintingName.value + ".png",
          Body: blob,
        });
        console.log(result);
      });
      dialogFormVisible_saveClo.value = false;
    };


    const changeToolColor = () => {
      ElMessageBox({
        title: "ChangeToolColor",
        message: () =>
          h(
            "div",
            {
              class: "pl-20px pt-20px",
            },
            [
              h(
                "div",
                {
                  class: "flex justify-between items-center",
                  style: { width: "40%" },
                },
                [
                  "setToolColor:",
                  h(ElColorPicker, {
                    modelValue: toolColor.value,
                    onChange: (color) => {
                      toolColor.value = color!;
                      canvas.value!.freeDrawingBrush.color = toolColor.value;
                    },
                  }),
                ]
              ),
            ]
          ),
      });
      console.log(toolColor.value);
    };

    const changeToolSize = () => {
      ElMessageBox({
        title: "ChangeToolSize",
        message: () =>
          h("div", { class: "pl-20px pt-20px" }, [
            h("div", {}, [
              "setToolSize",
              h(ElSlider, {
                modelValue: toolWidth.value,
                step: 5,
                max: 50,
                showStops: true,
                onInput: (val) => {
                  toolWidth.value = val as number;
                  canvas.value!.freeDrawingBrush.width = toolWidth.value;
                },
              }),
            ]),
          ]),
      });
    };

    onMounted(() => {
      init();
    });

    return {
      domCanvas,
      togglePenDraw,
      toggleErasing,
      toggleDrawLine,
      toggleDrawRect,
      toggleDrawCircle,
      downloadPicture,
      dialogFormVisible_saveClo,
      dialogFormVisible_saveLoc,
      SaveAsPainting,
      clearCanvas,
      changeToolSize,
      changeToolColor,
      previousStep,
      nextStep,
      paintingName,
      toggleDownloadPainting,
      toggleSaveAsPainting,
      selectOptions,
      selectedValue,
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
    @apply;
  }
  .canvas-toolbar {
    // @apply bg-teal-400;
    @apply flex flex-col justify-between;
    border-left: 1px solid var(--el-border-color);

    .canvas-actions {
      @apply flex-col flex;
      .el-button {
        @apply ml-1 mr-2px;
      }
    }

    .painting-actions {
      @apply bg-teal-700;
      @apply flex justify-center items-center;
      height: 80px;
      width: $canvasToolsBarWidth;
      .author-name {
        @apply mx-2px;
        white-space: wrap;
      }
    }
  }
}
</style>
