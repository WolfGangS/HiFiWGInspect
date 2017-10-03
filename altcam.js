

(function(){

	var isOn = false;

	var isActive = false;

	var overlayID  = null;


	Script.include([
		"clickHandler.js?" + Math.random()
	]);

	var clickHander = ClickHandler;

	function debug(e){
		print(JSON.stringify(e,null,2));
	}

	ClickHandler.mousePressEvent.connect(mousePressEvent);
	ClickHandler.mouseMoveEvent.connect(mouseMoveEvent);
	ClickHandler.mouseReleaseEvent.connect(mouseReleaseEvent);


	function mousePressEvent(e){
		if(!isOn)return;
		if(!e.isLeftButton || e.isRightButton || e.isMiddleButton)return;
		if(!e.isAlt) return;
		if(e.intersection == null)return;
		isActive = true;

		overlayID = Overlays.addOverlay("sphere",{position:e.intersection.intersection,dimensions:{x:0.1,y:0.1,z:0.1}});

		//debug(e);
	}

	function mouseMoveEvent(e){
		if(!isActive || !e.isAlt)return;



	}

	function mouseReleaseEvent(e){
		if(!isActive)return;
		if(e.isLeftButton){
			Overlays.deleteOverlay(overlayID);
			isActive = false;
		}
	}


	var tablet = Tablet.getTablet("com.highfidelity.interface.tablet.system");
    //print(JSON.stringify(Object.keys(tablet)));
    var button = tablet.addButton({
        //icon: "https://wolfgangs.github.io/HiFiPowerEdit/spanner-white.svg",
        //activeIcon: "https://wolfgangs.github.io/HiFiPowerEdit/spanner.svg",
        text: "AltCam",
        isActive: false,
        sortOrder: 30
    });
    button.clicked.connect(toggle);
    function toggle(){
    	isOn = !isOn;
        button.editProperties({ isActive: isOn });
    }


    Script.scriptEnding.connect(function() {
		ClickHandler.mousePressEvent.disconnect(mousePressEvent);
		ClickHandler.mouseMoveEvent.disconnect(mouseMoveEvent);
		ClickHandler.mouseReleaseEvent.disconnect(mouseReleaseEvent);
        button.clicked.disconnect(toggle);
        tablet.removeButton(button);
    });


})();