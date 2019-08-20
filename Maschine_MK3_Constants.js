
const padsC3HardwareMapping = [ 60 , 61 , 62 , 63 , 64 , 65 , 66 , 67 , 68 , 69 , 70 , 71 , 72 , 73 , 74 , 75 ];
const padsCCHardwareMapping = [ 71 , 72 , 73 , 74 , 75 , 76 , 77 , 78 , 79 , 80 , 81 , 82 , 83 , 84 , 85 , 86 ];
const allNotesOff = [ -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 , -1 ];
const kbAllZero = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

const mk3MidiChannel = {
		noteIn1 : 144,
		noteIn2 : 145,
		CC1 : 176,
		CC2 : 177,
		CC3 : 178,
		polyPressure : 160,
		PB1 : 224,
		PB2 : 225
}


const mk3HwProjectSection = {
	channelButton  : 0,
	pluginButton   : 1,
	arrangerButton : 2,
	mixerButton    : 3,
	browserButton  : 4,
	samplingButton : 5,
	fileButton     : 6,
	settingsButton : 7,
	autoButton     : 8,
	macroButton    : 9
//	pedalTip       : unmapped
//	pedalRing      : unmapped
	}

const mk3HwMainKnob = {
//  up, right, down, left all have RGB LEDs
	bigKnobUpButton    : 11,
	bigKnobRightButton : 12,
	bigKnobDownButton  : 13,
	bigKnobLeftButton  : 14,
	bigKnobClickButton : 15,
	bigKnobTurnKnob    : 16
//	bigKnobTouchButton : unmapped
	}

const mk3HwMainKnobSection = {
	volumeButton      : 18,
	swingButton       : 19,
	noteRepeatButton  : 20,
	tempoButton       : 21,
	lockButton        : 22
	}

const mk3HwStripSection = {
	pitchButton        : 24,
	modButton          : 25,
	performButton      : 26,
	notesButton        : 27,
	touchStripPosition : 28
//  touchStripTouch    : unmapped
	}

const mk3HwPadModeSection = {
	padModeButton   : 30,
	kbModeButton    : 31,
	chordModeButton : 32,
	stepModeButton  : 33
	}

const mk3HwPadLeftSection = {
	fixedVelButton : 35,
	sceneButton    : 36,
	patternButton  : 37,
	eventsButton   : 38,
	variButton     : 39,
	dupeButton     : 40,
	selectButton   : 41,
	soloButton     : 42,
	muteButton     : 43
	}

const mk3HwTransportSection = {
	restartLoopButton : 45,
	eraseButton       : 46,
	tapMetroButton    : 47,
	followButton      : 48,
	playButton        : 49,
	recordButton      : 50,
	stopButton        : 51
	}

const mk3HwScreenButtons0 = {
	ccButton0   : 53,
	ccButton1   : 54,
	ccButton2   : 55,
	ccButton3   : 56,
	ccButton4   : 57,
	ccButton5   : 58,
	ccButton6   : 59,
	ccButton7   : 60
	}

const mk3HwScreenKnobs0 = {
	ccKnob0   : 62,
	ccKnob1   : 63,
	ccKnob2   : 64,
	ccKnob3   : 65,
	ccKnob4   : 66,
	ccKnob5   : 67,
	ccKnob6   : 68,
	ccKnob7   : 69
	}

const mk3HwPads0 = {
	ccPad0   : 71,
	ccPad1   : 72,
	ccPad2   : 73,
	ccPad3   : 74,
	ccPad4   : 75,
	ccPad5   : 76,
	ccPad6   : 77,
	ccPad7   : 78,
	ccPad8   : 79,
	ccPad9   : 80,
	ccPad10  : 81,
	ccPad11  : 82,
	ccPad12  : 83,
	ccPad13  : 84,
	ccPad14  : 85,
	ccPad15  : 86
	}

	const mk3HwScreenButtons1 = {
		ccButton0   : 87,
		ccButton1   : 88,
		ccButton2   : 89,
		ccButton3   : 90,
		ccButton4   : 91,
		ccButton5   : 92,
		ccButton6   : 93,
		ccButton7   : 94
		}

	const mk3HwScreenKnobs1 = {
		ccKnob0   : 95,
		ccKnob1   : 96,
		ccKnob2   : 97,
		ccKnob3   : 98,
		ccKnob4   : 99,
		ccKnob5   : 100,
		ccKnob6   : 101,
		ccKnob7   : 102
		}

	const mk3HwGroupButtons = {
		ccGroup0   : 103,
		ccGroup1   : 104,
		ccGroup2   : 105,
		ccGroup3   : 106,
		ccGroup4   : 107,
		ccGroup5   : 108,
		ccGroup6   : 109,
		ccGroup7   : 110
		}

const mk3HwColorBase = {
    OFF          :  0,
    RED          :  4,
    ORANGE       :  8,
    LIGHT_ORANGE : 12,
    WARM_YELLOW  : 16,
    YELLOW       : 20,
    LIME         : 24,
    GREEN        : 28,
    MINT         : 32,
    CYAN         : 36,
    TURQUOISE    : 40,
    BLUE         : 44,
    PLUM         : 48,
    VIOLET       : 52,
    PURPLE       : 56,
    MAGENTA      : 60,
    FUCHSIA      : 64,
    WHITE        : 68
};

const mk3ColorPicker = [
	mk3HwColorBase.OFF,
	mk3HwColorBase.RED,
	mk3HwColorBase.ORANGE,
	mk3HwColorBase.LIGHT_ORANGE,
	mk3HwColorBase.WARM_YELLOW,
	mk3HwColorBase.YELLOW,
	mk3HwColorBase.LIME,
	mk3HwColorBase.GREEN,
	mk3HwColorBase.MINT,
	mk3HwColorBase.CYAN,
	mk3HwColorBase.TURQUOISE,
	mk3HwColorBase.BLUE,
	mk3HwColorBase.PLUM,
	mk3HwColorBase.VIOLET,
	mk3HwColorBase.PURPLE,
	mk3HwColorBase.MAGENTA,
	mk3HwColorBase.FUCHSIA,
	mk3HwColorBase.WHITE,
];

const bwColorDisplay = [
"OFF",
"RED",
"ORANGE",
"LIGHT_ORANGE",
"WARM_YELLOW",
"YELLOW",
"LIME",
"GREEN",
"MINT",
"CYAN",
"TURQUOISE",
"BLUE",
"PLUM",
"VIOLET",
"PURPLE",
"MAGENTA",
"FUCHSIA",
"WHITE"
];

const mk3HwColorBrightness = {
    DIM      : 0,
    DIMFL    : 1,
    BRIGHT   : 2,
    BRIGHTFL : 3
};

const mk3ColorBrightnessPicker = [
	mk3HwColorBrightness.DIM,
	mk3HwColorBrightness.DIMFL,
	mk3HwColorBrightness.BRIGHT,
	mk3HwColorBrightness.BRIGHTFL
];

const page0Chromatic   = [ 0 , 1 , 2 , 3 , 4 , 5 , 6 , 7 , 8 , 9 , 10 , 11 , 12 , 13 , 14 , 15];

// copied and edited from livid prototype script
// edit the next two arrays to modify the scale selection
const SCALES = 	[
[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],
[0,1,2,3,4,5,6,7,8,9,10,11],
[0,2,4,5,7,9,11],
[0,2,3,5,7,8,10],
[0,2,3,5,7,9,10],
[0,2,4,5,7,9,10],
[0,2,4,6,7,9,11],
[0,1,3,5,7,8,10],
[0,1,3,4,7,8,10],
[0,1,3,4,6,7,9,10],
[0,2,3,5,6,8,9,11],
[0,2,4,6,8,10],
[0,3,5,6,7,10],
[0,3,5,7,10],
[0,2,4,7,9],
[0,2,3,5,7,8,11],
[0,2,3,5,7,9,11],
[0,2,5,7,9,10],
[0,1,3,4,6,8,10],
[0,1,3,5,7,8,11],
[0,1,3,5,7,9,11],
[0,1,3,6,7,10,11],
[0,1,4,6,8,10,11],
[0,1,4,6,7,8,11],
[0,2,3,5,6,8,10,11],
[0,2,4,5,7,9,10,11],
[0,2,4,5,7,8,9,11],
[0,1,4,5,7,8,11],
[0,2,3,6,7,8,11],
[0,1,4,5,7,8,10],
[0,1,4,5,6,8,11],
[0,2,3,7,8],
[0,1,5,7,10],
[0,1,5,6,10],
[0,2,3,7,9],
[0,1,3,4,7,8],
[0,1,3,4,5,6,8,10]
];

const scaleSelector = ["Off",
			 "Chromatic",
			 "Major",
			 "Minor",
			 "Dorian",
			 "Mixolydian",
			 "Lydian",
			 "Phrygian",
			 "Locrian",
			 "Diminished",
			 "WholeHalf",
			 "Whole_Tone",
			 "Minor_Blues",
			 "Minor_Pentatonic",
			 "Major_Pentatonic",
			 "Harmonic_Minor",
			 "Melodic_Minor",
			 "Dominant_Sus",
			 "Super_Locrian",
			 "Neopolitan_Minor",
			 "Neopolitan_Major",
			 "Enigmatic_Minor",
			 "Enigmatic",
			 "Composite",
			 "Bebop_Locrian",
			 "Bebop_Dominant",
			 "Bebop_Major",
			 "Bhairav",
			 "Hungarian_Minor",
			 "Minor_Gypsy",
			 "Persian",
			 "Hirojoshi",
			 "In_Sen",
			 "Iwato",
			 "Kumoi",
			 "Pelog",
			 "Spanish"]

const noteLanesNamed = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const octaveIndexesNamed = ["-2", "-1", "0", "1", "2", "Middle 3", "4", "5", "6", "7", "8", "9"]
