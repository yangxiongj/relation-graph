<template>
  <g>
    <!-- 常规方式 -->
    <path
      :d="pathData"
      :class="['c-rg-line', relation.styleClass, checked ? 'c-rg-line-checked' : '']"
      :stroke="
        checked
          ? relationGraph.options.checkedLineColor
          : relation.color
          ? relation.color
          : relationGraph.options.defaultLineColor
      "
      :style="{
        'opacity': relation.opacity,
        'stroke-width':
          (relation.lineWidth
            ? relation.lineWidth
            : relationGraph.options.defaultLineWidth) + 'px',
      }"
      :marker-start="
        relation.showStartArrow && relationGraph.getArrow(relation, link, true)
      "
      :marker-end="
        relation.showEndArrow && relationGraph.getArrow(relation, link, false)
      "
      fill="none"
      @click="onClick(relation, $event)"
    />
    <g
      v-if="
        relationGraph.options.defaultShowLineLabel &&
        relationGraph.options.canvasZoom > 40
      "
      :transform="textTransform"
    >
      <text
        :key="'t-' + relation.seeks_id"
        :x="0"
        :y="0"
        :style="{
          opacity: relation.opacity,
          fill: checked
            ? relationGraph.options.checkedLineColor
            : relation.fontColor
            ? relation.fontColor
            : relation.color
            ? relation.color
            : undefined,
        }"
        class="c-rg-line-text"
        @click="onClick(relation, $event)"
      >
        {{ relation.text }}
      </text>
    </g>
  </g>
</template>

<script>
export default {
  name: 'SeeksRGLine',
  props: {
    relationGraph: {
      mustUseProp: true,
      default: () => {
        return {};
      },
      type: Object,
    },
    link: {
      mustUseProp: true,
      default: () => {
        return {};
      },
      type: Object,
    },
    relation: {
      mustUseProp: true,
      default: () => {
        return {};
      },
      type: Object,
    },
    relationIndex: {
      mustUseProp: true,
      default: () => {
        return 0;
      },
      type: Number,
    },
  },
  data() {
    return {
      is_flashing: false,
    };
  },
  computed: {
    checked() {
      return this.link.seeks_id === this.relationGraph.options.checkedLineId;
    },
    pathData() {
      const { path, textPosition } = this.relationGraph.createLinePath(
        this.link,
        this.relation,
        this.relationIndex
      );
      return path;
    },
    textTransform() {
      const { path, textPosition } = this.relationGraph.createLinePath(
        this.link,
        this.relation,
        this.relationIndex
      );
      return this.relationGraph.getTextTransform(
        this.relation,
        textPosition.x,
        textPosition.y,
        textPosition.rotate
      )
    },
  },
  show() {
    this.isShow = true;
  },
  watch: {},
  methods: {
    onClick(line, e) {
      // RGStore.commit('setCurrentLineId', this.lineProps.id)
      this.relationGraph.onLineClick(line, this.link, e);
    },
    isAllowShowNode(thisNode) {
      const _r =
        thisNode.isShow !== false &&
        thisNode.isHide !== true &&
        (!thisNode.lot.parent ||
          this.isAllowShowNode(thisNode.lot.parent, false) === true);
      return _r;
    },
  },
};
</script>

<style scoped>
/*.RGLine-enter-active {*/
/*transition: all .3s ease;*/
/*}*/
/*.RGLine-leave-active {*/
/*transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);*/
/*}*/
.c-rg-line-text {
  fill: #888888;
  font-size: 12px;
}
.c-rg-line {
  z-index: 1000;
  fill-rule: nonzero;
  /*marker-end: url('#arrow');*/
  /* firefox bug fix - won't rotate at 90deg angles */
  /*-moz-transform: rotate(-89deg) translateX(-190px);*/
  /*animation-timing-function:linear;*/
  /*animation: ACTRGLineInit 1s;*/
}
.c-rg-line-tool {
  stroke-dasharray: 5, 5, 5;
}
.c-rg-line-flash {
  /* firefox bug fix - won't rotate at 90deg angles */
  -moz-transform: rotate(-89deg) translateX(-190px);
  animation-timing-function: linear;
  animation: ACTRGLineChecked 10s;
}
@keyframes ACTRGLineInit {
  from {
    stroke-dashoffset: 10px;
    stroke-dasharray: 20, 20, 20;
  }

  to {
    stroke-dashoffset: 0;
    stroke-dasharray: 0, 0, 0;
  }
}
@keyframes ACTRGLineChecked {
  from {
    stroke-dashoffset: 352px;
  }

  to {
    stroke-dashoffset: 0;
  }
}
.c-rg-line-checked {
  /*stroke: var(--stroke);*/
  /*marker-end: var(--markerEndChecked) !important;*/
  stroke-width: 2px;
  stroke-dasharray: 5, 5, 5;
  stroke-dashoffset: 3px;
  stroke-linecap: butt;
  /*stroke: #FD8B37;*/
  stroke-linejoin: bevel;
  /* firefox bug fix - won't rotate at 90deg angles */
  /*-moz-transform: rotate(-89deg) translateX(-190px);*/
  animation-timing-function: linear;
  animation: ACTRGLineChecked 10s;
}
</style>
