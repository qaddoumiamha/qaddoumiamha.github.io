AFRAME.registerComponent("gestures",{
  init: function() {
    /*raycasterEl = document.getElementById('raycaster');
    raycasterEl.addEventListener('raycaster-intersection', evt => {
      console.log('aa')
      if (evt.detail.intersections.length > 0) {
        console.log(evt.detail.intersections.length)
        const intersectionEl = evt.detail.intersections[0].object.el;
        if (intersectionEl.components["ar-button"] !== undefined) {
          intersectionEl.components["ar-button"].invoke();
        }
      }
    })*/

    var el = document.querySelector('body');
    var hammer = new Hammer.Manager(el);

    //hammer.add(new Hammer.Tap({ event: 'doubletap', taps: 2 }));
    //hammer.add(new Hammer.Tap());
    hammer.add(new Hammer.Pan({ threshold: 0, pointers: 0 }));
    hammer.add(new Hammer.Pinch({ threshold: 0 }));

    //hammer.on("tap", onTap);
    //hammer.on("doubletap", onDoubleTap);

    hammer.on("panstart", onPanStart);
    hammer.on("panmove", onPan);

    hammer.on("pinchstart", onPinchStart);
    hammer.on("pinchmove", onPinch);
    //hammer.on("pinchstart pinchmove", onPinch);

    function onTap(ev) {
      //raycaster = document.getElementById('raycaster').components.raycaster;
      //raycaster.checkIntersections()
      //raycaster.clearAllIntersections()
    }

    function onDoubleTap(ev) {
      console.log('double')
      document.getElementById('ar-viewer').components["ar-viewer"].reset()
    }

    let rotation = 0;

    function onPanStart(ev) {
      rotation = 0;
    }

    function onPan(ev) {
      delta = ev.deltaX - rotation;
      rotation = ev.deltaX;
      document.getElementById('ar-viewer').components["ar-viewer"].rotate(delta)
    }

    let scale = 1;

    function onPinchStart(ev) {
      scale = 1;
    }

    function onPinch(ev) {
      delta = ev.scale - scale;
      scale = ev.scale;
      document.getElementById('ar-viewer').components["ar-viewer"].scale(delta)
    }    
  }
});

AFRAME.registerComponent("ar-viewer", {
  schema: {
    qrcodeSize: { type: 'number', default: 0.05 },
    barcodeSize: { type: 'number', default: 0.03 },
    barcodeValue: { type: 'int', default: 1 },
    scaleGesture: { type: 'boolean', default: true },
    rotateGesture: { type: 'boolean', default: true },
    resetGesture: { type: 'boolean', default: true },
    scaleMin: { type: 'number', default: 0.1 },
    scaleMax: { type: 'number', default: 2 },
    scaleSpeed: { type: 'number', default: 0.5 },
    rotateSpeed: { type: 'number', default: 0.5 }
  },
  init: function() {
    const el = this.el;
    const data = this.data;

    el.setAttribute('id', 'ar-viewer')

    let arViews = []
    let currentViewIndex = 0;

    populateArBoxes();
    activateFirstChild();

    function populateArBoxes() {
      for (var i = 0; i < el.children.length; i++) {
        if (el.children[i].components !== undefined) {
          const arView = el.children[i].components["ar-view"] 
          if (arView !== undefined) {
            arViews.push(arView);
          }
        }
      }
    }

    function activateFirstChild() {
      if (arViews.length > 0) {
        arViews[currentViewIndex].el.setAttribute('visible', true)
      }
    }

    data.arViews = arViews;
    data.currentViewIndex = currentViewIndex;
    data.lastScale = 1;
    data.lastRotation = 0;
  },
  previousView: function() {
    const data = this.data
    if (data.currentViewIndex - 1 >= 0) {
      data.arViews[data.currentViewIndex].el.setAttribute('visible', false);

      const el = this.el;
      el.setAttribute('scale', '1 1 1')
      el.setAttribute('rotation', '0 0 0')

      data.currentViewIndex = data.currentViewIndex - 1;
      data.arViews[data.currentViewIndex].el.setAttribute('visible', true);
    }
  },
  nextView: function() {
    const data = this.data
    if (data.currentViewIndex + 1 < data.arViews.length) {
      data.arViews[data.currentViewIndex].el.setAttribute('visible', false);

      const el = this.el;
      el.setAttribute('scale', '1 1 1')
      el.setAttribute('rotation', '0 0 0')

      data.currentViewIndex = data.currentViewIndex + 1;
      data.arViews[data.currentViewIndex].el.setAttribute('visible', true);
    }
  },
  reset: function() {
    const el = this.el;
    el.setAttribute('scale', '1 1 1')
    el.setAttribute('rotation', '0 0 0')

  },
  rotate: function(delta) {
    const el = this.el;
    const data = this.data;

    let r = data.lastRotation + delta * data.rotateSpeed;
    data.lastRotation = r;

    el.setAttribute('rotation', {x: 0, y: r, z: 0})
  },
  scale: function(scaleDelta) {
    const el = this.el;
    const data = this.data;

    scale = data.lastScale + scaleDelta * data.scaleSpeed;

    if (scale >= data.scaleMax) {
      scale = data.scaleMax;
    } else if (scale <= data.scaleMin) {
      scale = data.scaleMin
    }

    data.lastScale = scale;
    el.setAttribute('scale', {x: scale, y: scale, z: scale})
  }
})

AFRAME.registerComponent('ar-view', {
  schema: {
  },
  init: function() {
    const el = this.el;
    el.setAttribute('visible', false);
  }
})

AFRAME.registerComponent('ar-model', {

})

AFRAME.registerComponent('ar-loading', {

})

//General
AFRAME.registerComponent('ar-button', {
  schema: {
    target: {type: 'string', default: 'ar-viewer'},
    action: {type: 'string', default: ''},
  },
  init: function() {
    const el = this.el;
    el.classList.add('receive-raycast');
  },
  invoke: function() {
    const action = this.data.action

    if (action == "previous-view") {
      document.getElementById('ar-viewer').components["ar-viewer"].previousView()
    } else if (action == "next-view") {
      document.getElementById('ar-viewer').components["ar-viewer"].nextView()
    } else if (action == "reset") {
      document.getElementById('ar-viewer').components["ar-viewer"].reset()
    }
  }
})

AFRAME.registerComponent('ar-toggle', {

})

AFRAME.registerComponent('ar-slider', {

})

AFRAME.registerComponent('ar-double-slider', {

})

AFRAME.registerComponent('ar-note', {

})

//Specific
//Buttons
AFRAME.registerComponent('ar-previous-button', {
  
})

AFRAME.registerComponent('ar-next-button', {

})

AFRAME.registerComponent('ar-reset-button', {
  
})

//Toggles
AFRAME.registerComponent('ar-menu-toggle', {

})

AFRAME.registerComponent('ar-visibile-toggle', {

})

AFRAME.registerComponent('ar-transparency-toggle', {

})

AFRAME.registerComponent('ar-animation-toggle', {

})

AFRAME.registerComponent('ar-clip-toggle', {

})

//Sliders
AFRAME.registerComponent('ar-rotate-slider', {

})

AFRAME.registerComponent('ar-scale-slider', {

})

//Double Sliders
AFRAME.registerComponent('ar-clip-slider', {

})

function previousViewAction() {
  document.getElementById('ar-viewer').components["ar-viewer"].previousView()
}

function nextViewAction() {
  document.getElementById('ar-viewer').components["ar-viewer"].nextView()
}

function resetAction() {
  document.getElementById('ar-viewer').components["ar-viewer"].reset()
}