! function(win, dom) {
	function MyScrollBar(o) {
		this.init(o)
	}

	function getStyle(obj, name) {
		return win.getComputedStyle ? getComputedStyle(obj, null)[name] : obj.currentStyle[name]
	}

	function setStyle(obj, oStyle) {
		for (var i in oStyle) obj.style[i] = oStyle[i]
	}

	function getOffsetSize(obj) {
		var sDisplay = getStyle(obj, "display"),
			res = {};
		if ("none" != sDisplay) res.width = obj.offsetWidth, res.height = obj.offsetHeight;
		else {
			var oldStyle = {
					position: getStyle(obj, "position"),
					visibility: getStyle(obj, "visibility"),
					display: sDisplay
				},
				newStyle;
			setStyle(obj, {
				position: "absolute",
				visibility: "hidden",
				display: "inline-block"
			}), res.width = obj.offsetWidth, res.height = obj.offsetHeight, setStyle(obj, oldStyle)
		}
		return res
	}

	function getClientSize(obj) {
		var iTopW = parseInt(getStyle(obj, "borderTopWidth")),
			iRightW = parseInt(getStyle(obj, "borderRightWidth")),
			iBottomW = parseInt(getStyle(obj, "borderBottomWidth")),
			iLeftW = parseInt(getStyle(obj, "borderLeftWidth")),
			oOffset = getOffsetSize(obj);
		return {
			width: oOffset.width <= 0 ? oOffset.width : oOffset.width - iLeftW - iRightW,
			height: oOffset.height <= 0 ? oOffset.height : oOffset.height - iTopW - iBottomW
		}
	}

	function canSelectText(bCan) {
		bCan ? (dom.body.style.mozUserSelect = "text", dom.body.style.webkitUserSelect = "text", dom.body.style.msUserSelect = "text", dom.body.style.khtmlUserSelect = "text", dom.body.style.userSelect = "text") : (dom.body.style.mozUserSelect = "none", dom.body.style.webkitUserSelect = "none", dom.body.style.msUserSelect = "none", dom.body.style.khtmlUserSelect = "none", dom.body.style.userSelect = "none")
	}

	function getPosition(obj, goal) {
		var oPos = {
			top: obj.offsetTop,
			left: obj.offsetLeft
		};
		if (obj.parentNode == goal) return oPos;
		var obj = getPosition(obj.parentNode, goal);
		oPos.top += obj.top, oPos.left += obj.left
	}
	MyScrollBar.prototype.init = function(o) {
		this.bYBar = !1, this.iScrollTop = 0, this.iScrollLeft = 0, this.bYShow = !1, this.oWrapper = dom.getElementById(o.selId), this.oScroll = this.oWrapper.firstElementChild, this.setParam(o), this.addScrollBar(), this.initState(), this.initEvent()
	}, MyScrollBar.prototype.initState = function() {
		var sWPosition;
		"static" == getStyle(this.oWrapper, "position") && setStyle(this.oWrapper, {
			position: "relative"
		}), setStyle(this.oScroll, {
			position: "relative"
		}), this.bYBar && (setStyle(this.oYBox, {
			display: this.enterShow ? "none" : "block",
			position: "absolute",
			top: 0,
			right: 0,
			zIndex: 10,
			width: this.width + "px",
			height: "100%",
			backgroundColor: this.bgColor
		}), setStyle(this.oYBar, {
			position: "absolute",
			top: 0,
			left: 0,
			width: "100%",
			backgroundColor: this.barColor,
			borderRadius: this.borderRadius + "px",
			transition: "all " + this.time + "ms"
		})), this.setSize()
	}, MyScrollBar.prototype.initEvent = function() {
		var _this = this,
			sUserAgent; - 1 != win.navigator.userAgent.toLowerCase().indexOf("firefox") ? this.oWrapper.addEventListener("DOMMouseScroll", function(e) {
			_this.bYBar && _this.bYShow && (e.preventDefault(), _this.iScrollTop += e.detail > 0 ? 60 : -60, _this.iScrollTop = _this.iScrollTop <= 0 ? 0 : _this.iScrollTop >= _this.iScrollH - _this.iWrapperH ? _this.iScrollH - _this.iWrapperH : _this.iScrollTop, _this.setTransLate(), _this.setYTop(_this.iScrollTop / _this.iScrollH * _this.iYBoxH))
		}) : this.oWrapper.onmousewheel = function(evt) {
			if (_this.bYBar && _this.bYShow) {
				var e = evt || win.event;
				evt ? e.preventDefault() : e.returnValue = !1, _this.iScrollTop += e.wheelDelta < 0 ? 60 : -60, _this.iScrollTop = _this.iScrollTop <= 0 ? 0 : _this.iScrollTop >= _this.iScrollH - _this.iWrapperH ? _this.iScrollH - _this.iWrapperH : _this.iScrollTop, _this.setTransLate(), _this.setYTop(_this.iScrollTop / _this.iScrollH * _this.iYBoxH)
			}
		};
		var isInWrapper = !1;
		this.oWrapper.onmouseenter = function() {
			isInWrapper = !0, _this.enterShow && _this.bYBar && _this.bYShow && setStyle(_this.oYBox, {
				display: "block"
			})
		}, this.oWrapper.onmouseleave = function() {
			isInWrapper = !1, _this.enterShow && _this.bYBar && !bYDown && _this.bYShow && setStyle(_this.oYBox, {
				display: "none"
			})
		};
		var bYDown = !1,
			bYLeave = !0,
			iDownPageY = 0,
			iYBarTop = 0;
		this.bYBar && (this.enterColor && (this.oYBar.onmouseenter = function() {
			bYLeave = !1, setStyle(this, {
				backgroundColor: _this.enterColor
			})
		}, this.oYBar.onmouseleave = function() {
			bYLeave = !0, bYDown || setStyle(this, {
				backgroundColor: _this.barColor
			})
		}), this.oYBar.onmousedown = function(e) {
			_this.bYShow && (bYDown = !0, iDownPageY = e.clientY + dom.documentElement.scrollTop || dom.body.scrollTop, iYBarTop = parseInt(getStyle(this, "top")), _this.setYTime(0), canSelectText(!1))
		}, dom.addEventListener("mouseup", function() {
			bYDown && _this.bYShow && (bYDown = !1, _this.setYTime(_this.time), canSelectText(!0), !isInWrapper && _this.enterShow && setStyle(_this.oYBox, {
				display: "none"
			})), !bYDown && bYLeave && setStyle(_this.oYBar, {
				backgroundColor: _this.barColor
			})
		}), dom.addEventListener("mousemove", function(e) {
			if (bYDown && _this.bYShow) {
				var iNowPageY = e.clientY + dom.documentElement.scrollTop || dom.body.scrollTop,
					iNowTop = iYBarTop + iNowPageY - iDownPageY;
				iNowTop = iNowTop <= 0 ? 0 : iNowTop >= _this.iYBoxH - _this.iYBarH ? _this.iYBoxH - _this.iYBarH : iNowTop, _this.iScrollTop = iNowTop / _this.iYBoxH * _this.iScrollH, _this.setTransLate(), _this.setYTop(iNowTop)
			}
		}), this.oYBar.ondrag = function(e) {
			var e = evt || win.event;
			evt ? e.preventDefault() : e.returnValue = !1
		})
	}, MyScrollBar.prototype.setParam = function(o) {
		this.width = o.width ? o.width : 10, this.bgColor = o.bgColor ? o.bgColor : "#eaeaea", this.barColor = o.barColor ? o.barColor : "#ccc", this.enterColor = o.enterColor || !1, this.enterShow = !1 !== o.enterShow, this.hasY = !1 !== o.hasY, this.borderRadius = o.borderRadius >= 0 ? o.borderRadius : this.width / 2, this.time = o.time || 0
	}, MyScrollBar.prototype.addScrollBar = function() {
		this.getSize(), this.hasY && (this.bYBar = !0, this.oYBox = dom.createElement("div"), this.oYBar = dom.createElement("div"), this.oYBox.appendChild(this.oYBar), this.oWrapper.insertBefore(this.oYBox, this.oScroll))
	}, MyScrollBar.prototype.getSize = function() {
		var oWrapperSize = getClientSize(this.oWrapper),
			oScrollSize = getClientSize(this.oScroll);
		this.iWrapperClientH = oWrapperSize.height, this.iPaddingT = parseInt(getStyle(this.oWrapper, "paddingTop")), this.iPaddingR = parseInt(getStyle(this.oWrapper, "paddingRight")), this.iPaddingB = parseInt(getStyle(this.oWrapper, "paddingBottom")), this.iPaddingL = parseInt(getStyle(this.oWrapper, "paddingLeft")), this.iWrapperH = oWrapperSize.height - this.iPaddingT - this.iPaddingB, this.iScrollH = oScrollSize.height, this.bYBar && (this.iYBoxH = oWrapperSize.height, this.iYBarH = this.iWrapperH / this.iScrollH * this.iYBoxH)
	}, MyScrollBar.prototype.setSize = function(time) {
		var _this = this;
		time = time || 100, setTimeout(function() {
			_this.getSize(), _this.iScrollTop >= _this.iScrollH - _this.iWrapperH && (_this.iScrollTop = _this.iScrollH - _this.iWrapperH), _this.bYBar && (_this.iWrapperH >= _this.iScrollH ? (setStyle(_this.oYBox, {
				display: "none"
			}), _this.bYShow = !1) : (_this.enterShow || setStyle(_this.oYBox, {
				display: "block"
			}), setStyle(_this.oYBar, {
				height: _this.iYBarH + "px",
				top: _this.iScrollTop / _this.iScrollH * _this.iYBoxH + "px"
			}, 0), _this.bYShow = !0))
		}, time)
	}, MyScrollBar.prototype.setTransLate = function(iTime) {
		var sTranslate = "translate(-" + this.iScrollLeft + "px, -" + this.iScrollTop + "px)";
		setStyle(this.oScroll, {
			transition: "all " + (iTime >= 0 ? iTime : this.time) + "ms",
			transform: sTranslate,
			msTransform: sTranslate,
			mozTransform: sTranslate,
			webkitTransform: sTranslate,
			oTransform: sTranslate
		})
	}, MyScrollBar.prototype.setYTime = function(iTime) {
		setStyle(this.oYBar, {
			transition: "all " + (iTime >= 0 ? iTime : this.time) + "ms"
		})
	}, MyScrollBar.prototype.setYTop = function(iTop) {
		setStyle(this.oYBar, {
			top: iTop + "px"
		})
	}, MyScrollBar.prototype.jump = function(o) {
		o = o || {};
		var oPos = {
				top: 0,
				left: 0
			},
			iTop = 0,
			iBottome = this.iScrollH - this.iWrapperClientH + this.iPaddingT + this.iPaddingB > 0 ? this.iScrollH - this.iWrapperClientH + this.iPaddingT + this.iPaddingB : 0,
			iLeft = 0,
			iRight = this.iScrollW - this.iWrapperClientW + this.iPaddingL + this.iPaddingR > 0 ? this.iScrollW - this.iWrapperClientW + this.iPaddingL + this.iPaddingR : 0,
			obj;
		if (o.id) oPos = getPosition(document.getElementById(o.id), this.oScroll), this.bYBar && (oPos.top += this.iPaddingT);
		else if (o.pos)
			if ("string" == typeof o.pos) switch (o.pos) {
				case "top":
					oPos.top = 0;
					break;
				case "bottom":
					oPos.top = iBottome;
					break;
				case "left":
					oPos.left = 0;
					break;
				case "right":
					oPos.left = iRight
			} else "object" == typeof o.pos && (oPos = o.pos);
		oPos.top = oPos.top > iBottome ? iBottome : oPos.top >= 0 ? oPos.top : 0, this.iScrollTop = oPos.top, this.setTransLate(o.time), this.bYBar && (this.setYTime(o.time), this.setYTop(this.iScrollTop / this.iScrollH * this.iYBoxH))
	}, "function" == typeof define && define.amd && define([], function() {
		return MyScrollBar
	}), win.MyScrollBar = MyScrollBar
}(window, document);
