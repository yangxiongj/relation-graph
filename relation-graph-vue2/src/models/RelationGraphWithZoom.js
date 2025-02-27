import { getScreenHeight, getScreenWidth } from '@/utils/RGCommon';
import { RelationGraphWithDom } from '@/models/RelationGraphWithDom';
export class RelationGraphWithZoom extends RelationGraphWithDom {
  // eslint-disable-next-line no-useless-constructor
  constructor(options, listeners) {
    super(options, listeners);
  }

  zoom(buff, userZoomCenter) {
    // devLog('[zoom]', buff, 'from:', userZoomCenter);
    if ((this.options.canvasZoom + buff) < 10) {
      return;
    }
    const __new_zoom_value = this.options.canvasZoom + buff;
    const zoomCenter = this.showZoomCenter(userZoomCenter, buff);
    // devLog('zoomCenter:', zoomCenter.x, zoomCenter.y)
    // if (userZoomCenter) return
    // this.options.canvasOffset.zoom_buff_x = zoomCenter.buff_x
    // this.options.canvasOffset.zoom_buff_y = zoomCenter.buff_y
    // var _buff_x = this.canvasCenter.x - zoomCenter.x
    // var _buff_y = this.canvasCenter.y - zoomCenter.y
    // devLog('offset buff:', _buff_x.toFixed(0), _buff_y.toFixed(0))
    // this.options.canvasOffset.zoom_buff_x = _buff_x * ((this.options.canvasZoom - 100) / 100)
    // this.options.canvasOffset.zoom_buff_y = _buff_y * ((this.options.canvasZoom - 100) / 100)
    this.options.canvasOffset.x += zoomCenter.buff_x;
    this.options.canvasOffset.y += zoomCenter.buff_y;
    this.options.canvasZoom = __new_zoom_value;
    this.refreshNVAnalysisInfo();
  }

  setZoom(finalZoom, userZoomCenter) {
    const buff = Math.floor(finalZoom - this.options.canvasZoom);
    this.zoom(buff);
  }

  zoomCenter_of_newSize = { x: 0, y: 0 };

  showZoomCenter(userZoomCenter, zoomBuff) {
    if (!this.$dom) {
      return;
    }
    const _current_zoom = this.options.canvasZoom / 100;
    const _new_zoom = (this.options.canvasZoom + zoomBuff) / 100;
    this.currentZoomSet = this.analysisByZoom(_current_zoom, userZoomCenter);
    this.newZoomSet = this.analysisByZoom(_new_zoom, userZoomCenter);
    // devLog('this.currentZoomSet:', this.currentZoomSet)
    // devLog('this.currentZoomSet:', this.newZoomSet)
    const a = _new_zoom / _current_zoom;
    const b = 0;
    const c = 0;
    const d = _new_zoom / _current_zoom;
    const e = 0;
    const f = 0;
    this.zoomCenter_of_newSize.x = a * this.currentZoomSet.NMViewBuff.x + c * this.currentZoomSet.NMViewBuff.y + e;
    this.zoomCenter_of_newSize.y = b * this.currentZoomSet.NMViewBuff.x + d * this.currentZoomSet.NMViewBuff.y + f;
    const buff_x = this.currentZoomSet.NMViewBuff.x - this.zoomCenter_of_newSize.x;
    const buff_y = this.currentZoomSet.NMViewBuff.y - this.zoomCenter_of_newSize.y;
    this.zoomCenter_of_newSize.x += this.currentZoomSet.NMCanvasCenter.x;
    this.zoomCenter_of_newSize.y += this.currentZoomSet.NMCanvasCenter.y;
    // e = this.currentZoomSet.NMViewBuff.x
    // f = this.currentZoomSet.NMViewBuff.y
    // new start
    let old_x = this.currentZoomSet.NMCanvasStart.x - this.currentZoomSet.NMCanvasCenter.x;
    let old_y = this.currentZoomSet.NMCanvasStart.y - this.currentZoomSet.NMCanvasCenter.y;
    let new_x = a * old_x + c * old_y + e;
    let new_y = b * old_x + d * old_y + f;
    this.newZoomSet.NMCanvasStart.x = buff_x + this.currentZoomSet.NMCanvasCenter.x + new_x;
    this.newZoomSet.NMCanvasStart.y = buff_x + this.currentZoomSet.NMCanvasCenter.y + new_y;
    // new end
    old_x = this.currentZoomSet.NMCanvasEnd.x - this.currentZoomSet.NMCanvasCenter.x;
    old_y = this.currentZoomSet.NMCanvasEnd.y - this.currentZoomSet.NMCanvasCenter.y;
    new_x = a * old_x + c * old_y + e;
    new_y = b * old_x + d * old_y + f;
    this.newZoomSet.NMCanvasEnd.x = buff_x + this.currentZoomSet.NMCanvasCenter.x + new_x;
    this.newZoomSet.NMCanvasEnd.y = buff_x + this.currentZoomSet.NMCanvasCenter.y + new_y;
    this.currentZoomSet.NMCanvasOffsetBuff.x = buff_x;
    this.currentZoomSet.NMCanvasOffsetBuff.y = buff_y;
    // this.isShowZoomCenter = true
    return {
      buff_x, buff_y
    };
  }

  analysisByZoom(zoom, userZoomCenter) {
    const result = {
      NMViewPosition: { x: 0, y: 0 },
      NMViewCenter: { x: 0, y: 0 },
      NMCanvasCenter: { x: 0, y: 0 },
      NMCanvasStart: { x: 0, y: 0 },
      NMCanvasEnd: { x: 0, y: 0 },
      NMZoomCenter: { x: 0, y: 0 },
      NMViewBuff: { x: 0, y: 0 },
      NMCanvasOffsetBuff: { x: 0, y: 0 },
      NMCanvasSize: { width: 0, height: 0 }
    };
    const windowWidth = getScreenWidth();
    const windowHeight = getScreenHeight();
    const _view_info = this.$dom.getBoundingClientRect();
    result.NMViewPosition.x = _view_info.left;
    result.NMViewPosition.y = _view_info.top;
    if (_view_info.width + result.NMViewPosition.x > windowWidth) {
      result.NMViewCenter.x = (windowWidth - _view_info.left) / 2;
    } else {
      result.NMViewCenter.x = _view_info.width / 2;
    }
    if (_view_info.height + result.NMViewPosition.y > windowHeight) {
      result.NMViewCenter.y = (windowHeight - _view_info.top) / 2;
    } else {
      result.NMViewCenter.y = _view_info.height / 2;
    }
    const _NM_canvas_width = this.options.canvasSize.width * zoom;
    const _NM_canvas_height = this.options.canvasSize.height * zoom;
    result.NMCanvasCenter.x = this.options.canvasOffset.x + (this.options.canvasSize.width / 2); // + (this.options.canvasOffset.zoom_buff_x * _NM_canvas_width)
    result.NMCanvasCenter.y = this.options.canvasOffset.y + (this.options.canvasSize.height / 2); // + (this.options.canvasOffset.zoom_buff_y * _NM_canvas_height)
    result.NMCanvasStart.x = result.NMCanvasCenter.x - _NM_canvas_width / 2;
    result.NMCanvasStart.y = result.NMCanvasCenter.y - _NM_canvas_height / 2;
    result.NMCanvasEnd.x = result.NMCanvasCenter.x + _NM_canvas_width / 2;
    result.NMCanvasEnd.y = result.NMCanvasCenter.y + _NM_canvas_height / 2;
    result.NMZoomCenter.x = result.NMViewCenter.x;
    result.NMZoomCenter.y = result.NMViewCenter.y;
    if (userZoomCenter) {
      result.NMZoomCenter.x = userZoomCenter.x - result.NMViewPosition.x;
      result.NMZoomCenter.y = userZoomCenter.y - result.NMViewPosition.y;
    }
    let _NM_buff_x = result.NMViewCenter.x - result.NMCanvasCenter.x;
    let _NM_buff_y = result.NMViewCenter.y - result.NMCanvasCenter.y;
    if (userZoomCenter) {
      _NM_buff_x = result.NMZoomCenter.x - result.NMCanvasCenter.x;
      _NM_buff_y = result.NMZoomCenter.y - result.NMCanvasCenter.y;
    }
    result.NMViewBuff.x = _NM_buff_x;
    result.NMViewBuff.y = _NM_buff_y;
    result.NMCanvasSize.width = _NM_canvas_width;
    result.NMCanvasSize.height = _NM_canvas_height;
    return result;
  }
}
