debug = false;



var m_con_id = [];
var m_obj_name = [];
var m_obj_name2 = []; //possible second object/activity for 1 connection
var m_dir = [];
var m_dir2 = []; //possible direction for 2nd activity
var m_act_type = [];
var m_act_type2 = []; //possible activity type for 2nd activity
var m_ex_pers = [];
var m_comment = [];
var m_isDouble = []; //flag for beeing double
var m_isObje2 = []; //flag for different object when double

var m_countOccurence = [0,0,0,0,0,0,0,0]; // how often does the count ID occure



var mainData;
var imagesLoaded = false;

var jObjects = [];
var obId = [];
var xKoordObject = []; // width of object images
var yKoordObject = []; // height of object images

var imgFolder = "data/";
var x1, y1, x2, y2;

var immigrant;
var tSize, tw, sca; // Text Size, Text width, Scale Factor for Images
var immiText;
var commentTextStyle;
var immigrantTextStyle;

var commentBoxSize = 400;
var commentBoxPosi = commentBoxSize / 2;
var offset = 30;

var objje = [];
var exPersWidth, exPersHeight; // width & height of recipient images

var widt, higt;
var f = 1.00; // factor for manually adjust the "tSize" influence
var io = 0;
var sca = 0.3; // scaling factor for the object images
var exPersWidth = 180 * sca;
var exPersHeight = 180 * sca;
var widt;
var higt;
var padding = 15;

// Test Variables & Arrays
var gridCount = 5;
var actualName = "Immigrant Mother";


function preload() {
	mainData = loadTable("data/data4.csv", "csv", "header");
	immigrantTextStyle = loadFont("data/LucidaTypewriterBold.ttf");
}

function setup() {
	createCanvas(900, 600);
	tSize = 24;

	immiText = fill(139, 221, 255, 100).textAlign(CENTER).textFont(immigrantTextStyle, tSize);
	tw = textWidth(actualName);

	noStroke();
	rect(width / 2 - tw * 0.52, height / 2 - tSize * 1.4, tw * 1.04, tSize * 2, 8, 18, 8, 18);
	smooth();

	immigrant = new Immigrant(actualName);
  var maxObjects = 0;
	for (var i = 0; i < mainData.getRowCount(); i++) {  // collect the data and check double-connection exists
		
		m_con_id[i] = mainData.get(i, 'connection_id');
		if (m_con_id[i] == 0)	m_countOccurence[0]++; // counting how often an ID occoures. Not in use ATM!
		else if (m_con_id[i] == 1) m_countOccurence[1]++;
		else if (m_con_id[i] == 2) m_countOccurence[2]++;
		else if (m_con_id[i] == 3) m_countOccurence[3]++;
		else if (m_con_id[i] == 4) m_countOccurence[4]++;
		else if (m_con_id[i] == 5) m_countOccurence[5]++;
		else if (m_con_id[i] == 6) m_countOccurence[6]++;
		else if (m_con_id[i] == 7) m_countOccurence[7]++;
		
		m_obj_name[i] = mainData.get(i, 'obj_name');
		m_dir[i] = mainData.get(i, 'direction');
		m_act_type[i] = mainData.get(i, 'activity_type');
		m_ex_pers[i] = mainData.get(i, 'country') + '-' + mainData.get(i, 'gender') + '-' + mainData.get(i, 'rel_type');
		m_comment[i] = mainData.get(i, 'comment');
	}
	
	for(var i = 0; i<m_countOccurence.length; i++){ // check how many different Relations will be displayed. Not in use ATM!
		if(m_countOccurence[i] >0) maxObjects++;
	}


	// This will be replaced with the actual data
	for (var i = 0; i < mainData.getRowCount(); i++) {
		m_isDouble[i] = 0;
		m_isObje2[i] = 0;
		if (m_con_id[i] == m_con_id[i + 1]) { //check if there is a double relationship
			console.log("wie oft " + i);
			m_isDouble[i] = 1; //set double-check
			if (m_obj_name[i] == m_obj_name[i + 1]) m_obj_name2[i] = m_obj_name[i]; //check if it is the same object
			else {
				m_obj_name2[i] = m_obj_name[i + 1];
				m_isObje2[i] = 1;
			}

			if (m_dir[i] == m_dir[i + 1]) m_dir2[i] = m_dir[i]; //check if same direction
			else m_dir2[i] = m_dir[i + 1];

			if (m_act_type[i] == m_act_type[i + 1]) m_act_type2[i] = m_act_type[i]; //check if same activity type
			else m_act_type2[i] = m_act_type[i + 1];
		}
	console.log("m_o1 = " + m_obj_name[i] + " | o2 = " + m_obj_name2[i]);
		var obj = new Objects(i, m_con_id[i], m_obj_name[i], m_obj_name2[i], 180, 180, m_dir[i], m_dir2[i], m_act_type[i], m_act_type2[i], m_ex_pers[i], m_comment[i]);;
		objje.push(obj);
	}
}

function draw() {
	background(255);
	
	widt = width * 0.5;
	higt = height * 0.5;

	if (!imagesLoaded) {
		for (var i = 0; i < objje.length; i++) {
			var loaded = objje[i].checkImage();
			if (!loaded) break;
		}
		
		if (loaded) imagesLoaded = true;
		
	} else {
		immigrant.runImmigrant();
		io = io + 0.5;
		for (var i = 0; i < objje.length; i++) {
			objje[i].run();
		}
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function grid() {
	stroke(80, 90);
	strokeWeight(2);
	for (var i = gridCount; i >= 0; i--) {
		line((width / gridCount) * i, 0, (width / gridCount) * i, height);
		line(0, (height / gridCount) * i, width, (height / gridCount) * i);
	};
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

function Immigrant(_name) {
	nameToDisplay = _name;

	this.runImmigrant = function() {
		this.placePerson();
	}

	this.placePerson = function() {
		noStroke();
		fill(25, 25, 25, 255);
		immiText;
		text(nameToDisplay, width / 2, height / 2);
	}
}


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// CLASS

function Objects(_i, _count, _obName, _obName2, _xKoordOb, _yKoordOb, _dir, _dir2, _activityType, _activityType2, _xternalPerson, _comment) {

	this.objectWidth = _xKoordOb * sca;
	this.objectHeight = _yKoordOb * sca;
	
	this.index = _i;
	this.count = _count;

	this.obName = _obName;
	this.obName2 = _obName2;
	
	this.dir = _dir;
	this.dir2 = _dir2;

	var activityType = _activityType;
	var activityType2 = _activityType2;

	this.img = loadImage(imgFolder + this.obName + '.png');
	this.img2 = loadImage(imgFolder + this.obName2 + '.png');

	this.externalPerson = imgFolder + _xternalPerson;
	this.exImg = loadImage(this.externalPerson + '.png');

	if (_comment) this.comment = _comment;
	else this.comment = "";

	//set color for activity
	if (activityType == "presenting") { //green
		this.r = 1;
		this.g = 149;
		this.b = 63;
	} else if (activityType == "giving") { //orange
		this.r = 234;
		this.g = 78;
		this.b = 27;
	} else if (activityType == "borrowing and lending") { //yellow
		this.r = 255;
		this.g = 238;
		this.b = 63;
	} else if (activityType == "buying and selling") { //purple
		this.r = 102;
		this.g = 35;
		this.b = 132;
	} else if (activityType == "keeping and bringing") { // darkGray
		this.r = this.g = this.b = 28;
	}

	//set color2 for activity2 
	if (activityType2 == "presenting") { //green
		this.r2 = 1;
		this.g2 = 149;
		this.b2 = 63;
	} else if (activityType2 == "giving") { //orange
		this.r2 = 234;
		this.g2 = 78;
		this.b2 = 27;
	} else if (activityType2 == "borrowing and lending") { //yellow
		this.r2 = 255;
		this.g2 = 238;
		this.b2 = 63;
	} else if (activityType2 == "buying and selling") { //purple
		this.r2 = 102;
		this.g2 = 35;
		this.b2 = 132;
	} else if (activityType2 == "keeping and bringing") { // darkGray
		this.r2 = this.g2 = this.b2 = 28;
	}
}

Objects.prototype.checkImage = function() {
	var loaded = this.img.height > 1 && this.img.width > 1 && this.exImg.height > 1 && this.exImg.width;
	
	return loaded;
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
Objects.prototype.run = function() {
	this.sort();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//
Objects.prototype.sort = function() {
	// the direction FROM or TO immigrant??
	// 1 = FROM; 2 = TO; 3 = both
	if (this.dir == "from") {
		this.setXYvalues();
		this.displayConnections();
		this.displayObjects();
		this.displayActivities();
		this.displayExternalPersons();
		//if (this.comment != "") this.comments();
	} else if (this.dir == "to") {
		this.setXYvalues();
		this.displayActivities();
		this.displayObjects();
		this.displayConnections();
		this.displayExternalPersons();
	} else {}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// displays the objects 
Objects.prototype.displayObjects = function() {
	push();

	var trans = [];
	if (this.dir == "from" && !m_isDouble[this.count]) {
		if (this.count == 0) trans = [(x2 - this.objectWidth), (y2 - this.objectHeight)];
		else if (this.count == 1) trans = [(width / 2 - this.objectWidth / 2), (y2 - this.objectHeight)];
		else if (this.count == 2) trans = [(x2), (y2 - this.objectHeight)];
		else if (this.count == 3) trans = [(x2 - this.objectWidth), (y2)];
		else if (this.count == 4) trans = [(width / 2 - this.objectWidth / 2), (y2)];
		else if (this.count == 5) trans = [(x2), (y2)];
		else if (this.count == 6) trans = [x2 - this.objectWidth, y2 - this.objectHeight / 2];
		else if (this.count == 7) trans = [x2, y2 - this.objectHeight / 2];
		translate(trans[0], trans[1]);
		image(this.img, 0, 0, this.objectWidth, this.objectHeight);

	} else if (this.dir == "from" && m_isDouble[this.count] && !m_isObje2[this.count]) {
		if (this.count == 0) trans = [(x2 - this.objectWidth), (y2 - this.objectHeight)];
		else if (this.count == 1) trans = [(width / 2 - this.objectWidth / 2), (y2 - this.objectHeight)];
		else if (this.count == 2) trans = [(x2), (y2 - this.objectHeight)];
		else if (this.count == 3) trans = [(x2 - this.objectWidth), (y2)];
		else if (this.count == 4) trans = [(width / 2 - this.objectWidth / 2), (y2)];
		else if (this.count == 5) trans = [(x2), (y2)];
		else if (this.count == 6) trans = [x2 - this.objectWidth, y2 - this.objectHeight / 2];
		else if (this.count == 7) trans = [x2, y2 - this.objectHeight / 2];
		translate(trans[0], trans[1]);
		image(this.img, 0, 0, this.objectWidth, this.objectHeight);
		
		
	} else if (this.dir == "from" && m_isDouble[this.count] && m_isObje2[this.index]) {
		var xo1,yo1,xo2,yo2;
		if (this.count == 0) {
			trans = [(x2 - this.objectWidth), (y2 - this.objectHeight)];
			xo1 = -12;
			yo1 = +12;
			xo2 = +12;
			yo2 = -12;
		} else if (this.count == 1) {
			trans = [(width / 2 - this.objectWidth / 2), (y2 - this.objectHeight)];
			xo1 = 0;
			yo1 = 0;
			xo2 = 34;
			yo2 = 0;
		} else if (this.count == 2) {
			trans = [(x2), (y2 - this.objectHeight)];
			xo1 = 18;
			yo1 = 0;
			xo2 = -18;
			yo2 = -20;
		}
		
		else if (this.count == 3) trans = [(x2 - this.objectWidth), (y2)];
		else if (this.count == 4) trans = [(width / 2 - this.objectWidth / 2), (y2)];
		else if (this.count == 5) trans = [(x2), (y2)];
		else if (this.count == 6) trans = [x2 - this.objectWidth, y2 - this.objectHeight / 2];
		else if (this.count == 7) trans = [x2, y2 - this.objectHeight / 2];
		//console.log("x1 = " + x1 + " |y1 = " + y1 + " |x2 = " + x2 + " |y2 = " + y2)
		translate(trans[0], trans[1]);
		image(this.img, xo1, yo1, this.objectWidth*0.75, this.objectHeight*0.75);
		image(this.img2, xo2, yo2, this.objectWidth*0.75, this.objectHeight*0.75);
		
	}
	
	else if (this.dir == "to") {
		if (this.count == 0) trans = [x1 - this.objectWidth, y1 - this.objectHeight];
		else if (this.count == 1) trans = [x1 - this.objectWidth / 2, y1 - this.objectHeight];
		else if (this.count == 2) trans = [x1, y1 - this.objectHeight];
		else if (this.count == 3) trans = [x1 - this.objectWidth, y1];
		else if (this.count == 4) trans = [x1 - this.objectWidth / 2, y1];
		else if (this.count == 5) trans = [x1, y1];
		else if (this.count == 6) trans = [x1 - this.objectWidth, y1 - this.objectHeight / 2];
		else if (this.count == 7) trans = [x1, y1 - this.objectHeight / 2];
		translate(trans[0], trans[1]);
		image(this.img, 0, 0, this.objectWidth, this.objectHeight);
	}

	translate(trans[0], trans[1]);

	var mx = mouseX - trans[0];
	var my = mouseY - trans[1];

	//fill(this.r, this.g, this.b, 140);
	//rect(-padding / 2, -padding / 2, this.objectWidth + padding, this.objectHeight + padding);
	 // check here for mouse pos
	pop();
	
	
	
	//----------------------

	if (0 < mx && this.objectWidth > mx && 0 < my && this.objectHeight > my) {
		// show tooltip
		textAlign(LEFT).textStyle(NORMAL).fill(0).noStroke().textSize(12).textFont("Georgia");
		var commentVar = text(this.comment, widt - commentBoxPosi, height - offset, commentBoxSize, offset);

		if (this.count == 0) commentVar;
		else if (this.count == 1) commentVar;
		else if (this.count == 2) commentVar;
		else if (this.count == 3) commentVar;
		else if (this.count == 4) commentVar;
		else if (this.count == 5) commentVar;
		else if (this.count == 6) commentVar;
		else if (this.count == 7) commentVar;

		fill(color(208, 208, 208, 40));
		rect(widt - commentBoxPosi, height - offset, commentBoxSize, offset, 5, 5, 5, 5);
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// connecting Arrows
Objects.prototype.displayActivities = function() {
	push();
	var xTrans = (x1 - x2);
	var yTrans = (y1 - y2);

	if (this.dir == "from" && !m_isDouble[this.count]) {
		if (this.count == 1) translate((x1), (y2 - yTrans - this.objectHeight));
		else if (this.count == 0) translate((x2 - xTrans - this.objectWidth), (y2 - yTrans - this.objectHeight));
		else if (this.count == 2) translate((x2 - xTrans + this.objectWidth), (y2 - yTrans - this.objectHeight));
		else if (this.count == 4) translate(x2, y2 - yTrans + this.objectHeight);
		else if (this.count == 3) translate((x2 - xTrans - this.objectWidth), (y2 - yTrans + this.objectHeight));
		else if (this.count == 5) translate((x2 - xTrans + this.objectWidth), (y2 - yTrans + this.objectHeight));
		else if (this.count == 6) translate(x2 - xTrans - this.objectWidth, y2);
		else if (this.count == 7) translate(x2 - xTrans + this.objectWidth, y2);

		stroke(this.r, this.g, this.b, io);
		strokeWeight(4);
		line(0, 0, xTrans, yTrans);
		push();
		translate(0, 0);
		var a = atan2(x1 - x2, y2 - y1);
		rotate(a);
		line(0, 0, -10, -10);
		line(0, 0, 10, -10);
		pop();
		
	} else if (this.dir == "from" && m_isDouble[this.index]) {
		var x12,y12,x22,y22;
		if (this.count == 1) translate((x1), (y2 - yTrans - this.objectHeight));
		else if (this.count == 0) translate((x2 - xTrans - this.objectWidth), (y2 - yTrans - this.objectHeight));
		else if (this.count == 2) translate((x2 - xTrans + this.objectWidth), (y2 - yTrans - this.objectHeight));
		else if (this.count == 4) translate(x2, y2 - yTrans + this.objectHeight);
		else if (this.count == 3) translate((x2 - xTrans - this.objectWidth), (y2 - yTrans + this.objectHeight));
		else if (this.count == 5) translate((x2 - xTrans + this.objectWidth), (y2 - yTrans + this.objectHeight));
		else if (this.count == 6) translate(x2 - xTrans - this.objectWidth, y2);
		else if (this.count == 7) translate(x2 - xTrans + this.objectWidth, y2);
		
		if (this.count == 0) {
			x12 = 15;
			y12 = -15;
			x22 = 15;
			y22 = -15;
		} else if (this.count == 1) {
			x12 = 30;
			y12 = 0;
			x22 = 30;
			y22 = 0;

		} else if (this.count == 2) {
			x12 = -15;
			y12 = -15;
			x22 = -15;
			y22 = -15;
		}
		
		stroke(this.r, this.g, this.b, io);
		strokeWeight(4);
		line(0, 0, xTrans, yTrans);
		push();
		translate(0, 0);
		var a = atan2(x1 - x2, y2 - y1);
		rotate(a);
		line(0, 0, -10, -10);
		line(0, 0, 10, -10);
		pop();
		
		
		
		stroke(this.r2, this.g2, this.b2, io);
		line(x12, y12, xTrans+x12, yTrans+y12);
		push();
		translate(x12, y12);
		var a = atan2(x1 - x2, y2 - y1);
		rotate(a);
		line(0, 0, -10, -10);
		line(0, 0, 10, -10);
		pop();
	}

	else if(this.dir == "to" && !m_isDouble[this.count]) {
		stroke(this.r, this.g, this.b, io);
		strokeWeight(4);
		line(x1, y1, x2, y2);
		push();
		translate(x2, y2);
		var a = atan2(x1 - x2, y2 - y1);
		rotate(a);
		line(0, 0, -10, -10);
		line(0, 0, 10, -10);
		pop();
	}
	
	pop();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
// connection Line without ending arrow
Objects.prototype.displayConnections = function() {
	//console.log("isD: #" + this.count + " = " + m_isDouble[this.count]);

	push();
	strokeWeight(4);
	//console.log("isD: #" + this.count + " = " + m_isDouble[this.count]);
	if (this.dir == "from" && !m_isDouble[this.count]) {

		stroke(this.r, this.g, this.b, io);
		line(x1, y1, x2, y2)

	} else if (this.dir == "from" && m_isDouble[this.count]) {
		var x12,y12,x22,y22;
		
		if (this.count == 0) {
			x12 = x1+15;
			y12 = y1-15;
			x22 = x2+15;
			y22 = y2-15;
		} else if (this.count == 1) {
			x12 = x1+30;
			y12 = y1;
			x22 = x2+30;
			y22 = y2;
		} else if (this.count == 2) {
			x12 = x1-15;
			y12 = y1-15;
			x22 = x2-15;
			y22 = y2-15;
		}
		stroke(this.r, this.g, this.b, io);
		line(x1, y1, x2, y2);

		stroke(this.r2, this.g2, this.b2, io);
		line(x12, y12, x22, y22);
	}


	var xTrans = x1 - x2;
	var yTrans = y1 - y2;
	if (this.dir == "to") {
		if (this.count == 0) translate((x1 - this.objectWidth), (y2 - this.objectHeight + yTrans));
		else if (this.count == 1) translate((width / 2), (y2 - this.objectHeight + yTrans));
		else if (this.count == 2) translate((x1 + this.objectWidth), y1 - this.objectHeight);
		else if (this.count == 3) translate((x1 - this.objectWidth), y1 + this.objectHeight);
		else if (this.count == 4) translate((x1), y1 + this.objectHeight);
		else if (this.count == 5) translate((x1 + this.objectWidth), y1 + this.objectHeight);
		else if (this.count == 6) translate((x1 - this.objectWidth), y1);
		else if (this.count == 7) translate((x1 + this.objectWidth), y1);
		stroke(this.r, this.g, this.b, io);


		if (this.dir == "from") line(x1, y1, x2, y2);
		else if (this.dir == "to") line(0, 0, xTrans, yTrans);
	}

	//fill(this.r + 100, this.g + 100, this.b + 100, 40);
	//strokeWeight(1);
	//rect(x1, y1, x2, y2);

	pop();
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/
//
Objects.prototype.displayExternalPersons = function() {
	push();
	var trans = [];

	if (this.dir == "from") {
		var xTrans = 2 * (x1 - x2);
		var yTrans = 2 * (y1 - y2);

		if (this.count == 0) trans = [(x1 - xTrans - this.objectWidth - exPersWidth), (y1 - yTrans - this.objectHeight - exPersHeight)];
		else if (this.count == 1) trans = [(width / 2 - exPersWidth / 2), (y2 - yTrans / 2 - 3 - this.objectHeight - exPersHeight)];
		else if (this.count == 2) trans = [(x1 - xTrans + this.objectWidth), (y1 - yTrans - this.objectHeight - exPersHeight)];
		else if (this.count == 3) trans = [(x1 - xTrans - this.objectWidth - exPersWidth), (y1 - yTrans + this.objectHeight)];
		else if (this.count == 4) trans = [x2 - exPersWidth / 2, y2 + this.objectHeight - (y1 - y2)];
		else if (this.count == 5) trans = [x2 + this.objectWidth - xTrans / 2, y2 + this.objectHeight - yTrans / 2];
		else if (this.count == 6) trans = [x2 - xTrans / 2 - this.objectWidth - exPersWidth, y2 - exPersHeight / 2];
		else if (this.count == 7) trans = [x2 - xTrans / 2 + this.objectWidth, y2 - exPersHeight / 2];

	} else if (this.dir == "to") {
		var xTrans = (x1 - x2);
		var yTrans = (y1 - y2);

		if (this.count == 0) trans = [(x1 + xTrans - this.objectWidth - exPersWidth), (y1 + yTrans - this.objectHeight - exPersHeight)];
		else if (this.count == 1) trans = [(x1 - exPersWidth / 2), (y1 + yTrans - this.objectHeight - exPersHeight)];
		else if (this.count == 2) trans = [(x1 + this.objectWidth + xTrans), y1 - this.objectHeight + yTrans - exPersHeight];
		else if (this.count == 3) trans = [(x1 - this.objectWidth + xTrans - exPersWidth), y1 + this.objectHeight + yTrans];
		else if (this.count == 4) trans = [(x1 - exPersWidth / 2), y1 + this.objectHeight + yTrans];
		else if (this.count == 5) trans = [(x1 + this.objectWidth + xTrans), y1 + this.objectHeight + yTrans];
		else if (this.count == 6) trans = [(x1 - this.objectWidth + xTrans - exPersWidth), y1 - exPersHeight / 2];
		else if (this.count == 7) trans = [(x1 + this.objectWidth + xTrans), y1 - exPersHeight / 2];
	}

	translate(trans[0], trans[1]);

	var mx = mouseX - trans[0];
	var my = mouseY - trans[1];

	fill(this.r, this.g, this.b, 140);
	//	rect(-padding/2, -padding/2, exPersWidth+padding, exPersHeight+padding);
	image(this.exImg, 0, 0, exPersWidth, exPersHeight);
	pop();

	if (0 < mx && this.objectWidth > mx && 0 < my && this.objectHeight > my) {
		// show tooltip
		textAlign(LEFT).textStyle(NORMAL).fill(0).noStroke().textSize(12).textFont("Georgia");
		var commentVar = text(this.comment, widt - commentBoxPosi, height - offset, commentBoxSize, offset);

		if (this.count == 0) commentVar;
		else if (this.count == 1) commentVar;
		else if (this.count == 2) commentVar;
		else if (this.count == 3) commentVar;
		else if (this.count == 4) commentVar;
		else if (this.count == 5) commentVar;
		else if (this.count == 6) commentVar;
		else if (this.count == 7) commentVar;

		fill(color(208, 208, 208, 40));
		rect(widt - commentBoxPosi, height - offset, commentBoxSize, offset, 5, 5, 5, 5);
	}
}

/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/

Objects.prototype.setXYvalues = function() {

	//console.log("count = " + this.count);
	var twm = map(tw, 33, 305, 185, 275);
	if (this.dir == "from") {
		//console.log("TW = " + tw);
		//console.log("tsize = " + tSize);
		//console.log(widt);
		if (this.count == 0) {
			x1 = widt - twm / 3;
			y1 = higt - (tSize * f) * 2;
			x2 = widt - twm * 0.65;
			y2 = higt - (tSize * f) * 4;
		} else if (this.count == 1) {
			x1 = widt;
			y1 = higt - (tSize * f) * 2;
			x2 = widt;
			y2 = higt - (tSize * f) * 4;
		} else if (this.count == 2) {
			x1 = widt + twm / 3;
			y1 = higt - (tSize * f) * 2;
			x2 = widt + twm * 0.65;
			y2 = higt - (tSize * f) * 4;
		} else if (this.count == 3) {
			x1 = widt - twm / 3;
			y1 = higt + (tSize * f) * 0.95;
			x2 = widt - twm * 0.55;
			y2 = higt + (tSize * f) * 3;
		} else if (this.count == 4) {
			x1 = widt;
			y1 = higt + (tSize * f) * 0.95;
			x2 = widt;
			y2 = higt + (tSize * f) * 3;
		} else if (this.count == 5) {
			x1 = widt + twm / 3;
			y1 = higt + (tSize * f) * 0.95;
			x2 = widt + twm * 0.6;
			y2 = higt + (tSize * f) * 3;
		} else if (this.count == 6) {
			x1 = widt - twm * 0.61;
			y1 = higt - (tSize * f) / 2;
			x2 = widt - twm * 0.85;
			y2 = higt - (tSize * f) / 2;
		} else if (this.count == 7) {
			x1 = widt + twm * 0.61;
			y1 = higt - (tSize * f) / 2;
			x2 = widt + twm * 0.85;
			y2 = higt - (tSize * f) / 2;
		}
	} else if (this.dir == "to") {
		if (this.count == 0) {
			x1 = widt - twm * 0.65;
			y1 = higt - (tSize * f) * 4;
			x2 = widt - twm / 3;
			y2 = higt - (tSize * f) * 2;
		} else if (this.count == 1) {
			x1 = widt;
			y1 = higt - (tSize * f) * 4;
			x2 = widt;
			y2 = higt - (tSize * f) * 2;
		} else if (this.count == 2) {
			x1 = widt + twm * 0.65;
			y1 = higt - (tSize * f) * 4;
			x2 = widt + twm / 3;
			y2 = higt - (tSize * f) * 2;
		} else if (this.count == 3) {
			x1 = widt - twm * 0.55;
			y1 = higt + (tSize * f) * 3;
			x2 = widt - twm / 3;
			y2 = higt + (tSize * f) * 0.95;
		} else if (this.count == 4) {
			x1 = widt;
			y1 = higt + (tSize * f) * 3;
			x2 = widt;
			y2 = higt + (tSize * f) * 0.95;
		} else if (this.count == 5) {
			x1 = widt + twm * 0.6;
			y1 = higt + (tSize * f) * 3;
			x2 = widt + twm / 3;
			y2 = higt + (tSize * f) * 0.95;
		} else if (this.count == 6) {
			x1 = widt - twm * 0.85;
			y1 = higt - (tSize * f) / 2;
			x2 = widt - twm * 0.51;
			y2 = higt - (tSize * f) / 2;
		} else if (this.count == 7) {
			x1 = widt + twm * 0.85;
			y1 = higt - (tSize * f) / 2;
			x2 = widt + twm * 0.51;
			y2 = higt - (tSize * f) / 2;
		}
	}

	if (debug) {
		println("--------------- START XY values:");
		//println("this.count " + this.count);
		println("OBj-x1 =  " + x1 + " | OBj-y1 = " + y1);
		println("OBj-x2 =  " + x2 + " | OBj-y2 = " + y2);
		//println("objNem: " + this.obName);
	}
}