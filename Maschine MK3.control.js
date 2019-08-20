// Native Instruments Maschine MK3 script by BBUMPPS
// With the help of bitwigs current controller scripts, and Jürgen Moßgraber's tutorials

loadAPI(8);
load("Maschine_MK3_Constants.js");
host.setShouldFailOnDeprecatedUse(true);
host.defineController("Native Instruments", "Maschine MK3", "1.0", "ceb96f10-9149-11e9-b475-0800200c9a66", "BBUMPPS");
host.defineMidiPorts(1, 1);
host.addDeviceNameBasedDiscoveryPair(["Maschine MK3 Ctrl MIDI"],["Maschine MK3 Ctrl MIDI"]);

// set some variables and create object for state machine
const LOWEST_CC = 0;
const HIGHEST_CC = 119;
const DEVICE_START_CC = 62;
const DEVICE_END_CC = 69;
const noteMapDefault  = initArray(-1, 128);
const keyTableNoteOff = -1;
const padStartIndex   =  0;
const padRangeLimit   = 16;

const currentState = {
		currentScaleChoice: null,
		currentKbOctave: null,
		currentRootNote: null,
		currentRootNoteIndex: null,
		currentNoteMap: null,
		currentVelocityMap: null,
		currentRootNoteColor: null,
		currentRootNoteAccentColor: null,
		currentNonRootNoteColor: null,
		currentNonRootNoteAccentColor: null,
		currentSelectedSlot: null,
		currentSelectedTrack: null,
		isClipLauncherSelected: null
}

const mk3Knob2WayFB = function (data1, data2) {
		var index = data1 - DEVICE_START_CC;
		remoteControls.getParameter(index).getAmount().value().set(data2, 128);
}

const mk3ScalePadColor = function(padCounter, scaleChoice, rootNoteColor, nonRootNoteColor) {
	if (scaleChoice[padCounter % scaleChoice.length] === 0) {
		host.getMidiOutPort(0).sendMidi(176, padsCCHardwareMapping[padCounter], rootNoteColor);
// set the color of the off pads
} else {
		host.getMidiOutPort(0).sendMidi(176, padsCCHardwareMapping[padCounter], nonRootNoteColor);
	}
	if (initNoteMap[padsC3HardwareMapping[padCounter]] === -1) {
		host.getMidiOutPort(0).sendMidi(176, padsCCHardwareMapping[padCounter], mk3HwColorBase.OFF);
	}
}

function init()

{
		mk3MidiIn =	host.getMidiInPort(0).setMidiCallback(onMidi);
		host.getMidiInPort(0).setSysexCallback(onSysex);
		noteIn =	host.getMidiInPort(0).createNoteInput("MK3 KB", "??????");
		noteIn.setShouldConsumeEvents(false);
		transport =	host.createTransport();
		application =	host.createApplication();
		cursorTrack =	host.createCursorTrack ("MK3_Cursor_Track", "Selected Track", 0, 127, true);
		cursorDevice =	cursorTrack.createCursorDevice();
		remoteControls =	cursorDevice.createCursorRemoteControlsPage(8);
		notif =	host.getNotificationSettings();

// create action arrays for future mapping
		actionCategories = application.getActionCategories();
		editingActions = actionCategories[0].getActions();
		projectActions = actionCategories[1].getActions();
		panelManagementActions = actionCategories[2].getActions();
		zoomingActions = actionCategories[3].getActions();
		noteEditorActions = actionCategories[4].getActions();
		arrangerActions = actionCategories[5].getActions();
		multisampleActions = actionCategories[6].getActions();
		generalActions = actionCategories[7].getActions();
		helpActions = actionCategories[8].getActions();
		dialogsActions = actionCategories[9].getActions();
		navigationActions = actionCategories[10].getActions();
		fileActions = actionCategories[11].getActions();
		selectionActions = actionCategories[12].getActions();
		textEditingActions = actionCategories[13].getActions();
		browserActions = actionCategories[14].getActions();
		mixerActions = actionCategories[15].getActions();
		windowManagementActions = actionCategories[16].getActions();
		clipLauncherActions = actionCategories[17].getActions();

// set current state
		initNoteMap = initArray(-1, 128);
		initVelocityMap = initArray(-1, 128)
		for (i = 0; i < 128; i++) {
				initNoteMap[i] = -1;
				initVelocityMap[i] = 127;
		};

// edit these to customize the initialized keyboard and colors
// play with the knobs, just note where they are and update here!
		currentState.currentRootNoteColor = mk3ColorPicker[1];
		currentState.currentRootNoteAccentColor = 3;
		currentState.currentNonRootNoteColor = mk3ColorPicker[9];
		currentState.currentNonRootNoteAccentColor = 0;
		currentState.currentKbOctave = 5;
		currentState.currentRootNoteIndex = 0;
		currentState.currentRootNote = currentState.currentRootNoteIndex + (currentState.currentKbOctave * 12);
		currentState.currentScaleChoice = SCALES[1];

		cursorTrackPosition = cursorTrack.position().addValueObserver(function(position) {
				currentState.currentSelectedTrack = position;
				// println(position);
		});

// setting the controller knobs to match for smooth takeover
// update these if you play with the above section
		host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, mk3HwScreenKnobs1.ccKnob0, 0);
		host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, mk3HwScreenKnobs1.ccKnob1, 1);
		host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, mk3HwScreenKnobs1.ccKnob2, 5);
		host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, mk3HwScreenKnobs1.ccKnob3, 127);
		host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, mk3HwScreenKnobs1.ccKnob4, 1);
		host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, mk3HwScreenKnobs1.ccKnob5, 3);
		host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, mk3HwScreenKnobs1.ccKnob6, 9);
		host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, mk3HwScreenKnobs1.ccKnob7, 0);

		host.showPopupNotification(noteLanesNamed[currentState.currentRootNoteIndex] + " " + scaleSelector[1] + " Octave: " + octaveIndexesNamed[currentState.currentKbOctave]);

// Cursor track
		mk3CursorTrack = cursorTrack;
		mk3ClipLauncher0 = mk3CursorTrack.clipLauncherSlotBank();
		mk3ClipLauncher0.setIndication(false);
		mk3ClipLauncher0.addIsSelectedObserver(function(slotIndex, isSelected) {
// function to print current track and launcher slot
		if (isSelected === true) {
			// println("Track " + currentState.currentSelectedTrack + " and slot " + (slotIndex + 1) + " is currently selected");
			currentState.currentSelectedSlot = slotIndex;
			currentState.isClipLauncherSelected = true;
		} else {
			currentState.isClipLauncherSelected = false;
		}
})

// update controller knobs to have current parameter value
		for ( let i = 0; i < 8; i++) {
				p = remoteControls.getParameter(i).getAmount();
		// update device parameters so takeover can happen smoothly
				p.value().addValueObserver(128, function(pvalue) {
						host.getMidiOutPort(0).sendMidi(mk3MidiChannel.CC1, DEVICE_START_CC + i, pvalue);
				});
				p.setIndication(true);
				p.setLabel("P" + (i + 1));
		}

		initOctaveCounter = -1;
		for (let padCounter = padStartIndex; padCounter < padRangeLimit; padCounter++) {
				if (padCounter % currentState.currentScaleChoice.length === 0) {
						initOctaveCounter++;
				}
				if ((currentState.currentRootNote + currentState.currentScaleChoice[padCounter % currentState.currentScaleChoice.length] + (12 * initOctaveCounter)) <= 127) {
						initNoteMap[padsC3HardwareMapping[padCounter]] = currentState.currentRootNote + currentState.currentScaleChoice[padCounter % currentState.currentScaleChoice.length] + (12 * initOctaveCounter)
				} else {
					initNoteMap[padsC3HardwareMapping[padCounter]] = -1;
				}
				mk3ScalePadColor(padCounter, currentState.currentScaleChoice, currentState.currentRootNoteColor + currentState.currentRootNoteAccentColor, currentState.currentNonRootNoteColor + currentState.currentNonRootNoteAccentColor);
		}

		println(initNoteMap);
		noteIn.setKeyTranslationTable(initNoteMap);
		noteIn.setVelocityTranslationTable(initVelocityMap);

//end of INIT
}

function onMidi(status, data1, data2)
{
		switch (status) {
				case mk3MidiChannel.CC1:
						switch (data1) {
// Application Commands
						case mk3HwTransportSection.playButton:
								if (data2 === 127) {
									// play or stop
										projectActions[10].invoke();
								}
										break;

// Keyboard Stuff
// Root Note
							case mk3HwScreenKnobs1.ccKnob0:
									currentState.currentRootNote = (currentState.currentKbOctave * 12) + data2;
									currentState.currentRootNoteIndex = data2;
									rootOctaveCounter = -1;
									for (let padCounter = padStartIndex; padCounter < padRangeLimit; padCounter++) {
										// println(padCounter % currentState.currentScaleChoice.length);
											if (padCounter % currentState.currentScaleChoice.length === 0) {
													rootOctaveCounter++;
											}
											if ((currentState.currentRootNote + currentState.currentScaleChoice[padCounter % currentState.currentScaleChoice.length] + (12 * rootOctaveCounter)) <= 127) {
													initNoteMap[padsC3HardwareMapping[padCounter]] = currentState.currentRootNote + currentState.currentScaleChoice[padCounter % currentState.currentScaleChoice.length] + (12 * rootOctaveCounter)
											} else {
												initNoteMap[padsC3HardwareMapping[padCounter]] = -1;
											}
									}
									// println(initNoteMap);
									noteIn.setKeyTranslationTable(initNoteMap);
									host.showPopupNotification("Current Root: " + noteLanesNamed[data2]);
											break;
// Scale Picker
									case mk3HwScreenKnobs1.ccKnob1:
											currentState.currentScaleChoice = SCALES[data2];
											scaleOctaveCounter = -1;
											for (let padCounter = padStartIndex; padCounter < padRangeLimit; padCounter++) {
												// println(padCounter % currentState.currentScaleChoice.length);
													if (padCounter % currentState.currentScaleChoice.length === 0) {
															scaleOctaveCounter++;
													}
													if ((currentState.currentRootNote + currentState.currentScaleChoice[padCounter % currentState.currentScaleChoice.length] + (12 * scaleOctaveCounter)) <= 127) {
															initNoteMap[padsC3HardwareMapping[padCounter]] = currentState.currentRootNote + currentState.currentScaleChoice[padCounter % currentState.currentScaleChoice.length] + (12 * scaleOctaveCounter)
													} else {
														initNoteMap[padsC3HardwareMapping[padCounter]] = -1;
													}
													if (data2 === 0) {
														initNoteMap[padsC3HardwareMapping[padCounter]] = -1;
													}
											mk3ScalePadColor(padCounter, SCALES[data2], currentState.currentRootNoteColor + currentState.currentRootNoteAccentColor, currentState.currentNonRootNoteColor  + currentState.currentNonRootNoteAccentColor);
											}
											// println(initNoteMap);
											noteIn.setKeyTranslationTable(initNoteMap);
											host.showPopupNotification("Current Scale: " + scaleSelector[data2]);
													break;
// Octave switcher
									case mk3HwScreenKnobs1.ccKnob2:
											currentState.currentKbOctave = data2;
											currentState.currentRootNote = (currentState.currentKbOctave * 12) + currentState.currentRootNoteIndex;
											octOctaveCounter = -1;
											for (let padCounter = padStartIndex; padCounter < padRangeLimit; padCounter++) {
												// println(padCounter % currentState.currentScaleChoice.length);
													if (padCounter % currentState.currentScaleChoice.length === 0) {
															octOctaveCounter++;
													}
													if ((currentState.currentRootNote + currentState.currentScaleChoice[padCounter % currentState.currentScaleChoice.length] + (12 * octOctaveCounter)) <= 127) {
															initNoteMap[padsC3HardwareMapping[padCounter]] = currentState.currentRootNote + currentState.currentScaleChoice[padCounter % currentState.currentScaleChoice.length] + (12 * octOctaveCounter)
													} else {
														initNoteMap[padsC3HardwareMapping[padCounter]] = -1;
													}
											}
											// println(initNoteMap);
											noteIn.setKeyTranslationTable(initNoteMap);
											host.showPopupNotification("Current Octave: " + octaveIndexesNamed[data2]);
													break;
									case mk3HwScreenKnobs1.ccKnob3:
													initVelocityMap[127] = data2;
											noteIn.setVelocityTranslationTable(initVelocityMap);
													break;
									case mk3HwScreenKnobs1.ccKnob4:
											currentState.currentRootNoteColor = mk3ColorPicker[data2];
											for (let padCounter = padStartIndex; padCounter < padRangeLimit; padCounter++) {
													mk3ScalePadColor(padCounter, currentState.currentScaleChoice, currentState.currentRootNoteColor + currentState.currentRootNoteAccentColor, currentState.currentNonRootNoteColor + currentState.currentNonRootNoteAccentColor);
											}
													break;
									case mk3HwScreenKnobs1.ccKnob5:
											currentState.currentRootNoteAccentColor = data2;
											for (let padCounter = padStartIndex; padCounter < padRangeLimit; padCounter++) {
													mk3ScalePadColor(padCounter, currentState.currentScaleChoice, currentState.currentRootNoteColor + currentState.currentRootNoteAccentColor, currentState.currentNonRootNoteColor + currentState.currentNonRootNoteAccentColor);
											}
													break;
									case mk3HwScreenKnobs1.ccKnob6:
											currentState.currentNonRootNoteColor = mk3ColorPicker[data2];
											for (let padCounter = padStartIndex; padCounter < padRangeLimit; padCounter++) {
													mk3ScalePadColor(padCounter, currentState.currentScaleChoice, currentState.currentRootNoteColor + currentState.currentRootNoteAccentColor, currentState.currentNonRootNoteColor  + currentState.currentNonRootNoteAccentColor);
											}
													break;
									case mk3HwScreenKnobs1.ccKnob7:
											currentState.currentNonRootNoteAccentColor = data2;
											for (let padCounter = padStartIndex; padCounter < padRangeLimit; padCounter++) {
													mk3ScalePadColor(padCounter, currentState.currentScaleChoice, currentState.currentRootNoteColor + currentState.currentRootNoteAccentColor, currentState.currentNonRootNoteColor + currentState.currentNonRootNoteAccentColor);
											}
													break;

// device page control
						case mk3HwScreenButtons0.ccButton0:
								if (data2 === 127) {
										remoteControls.selectPreviousPage(true);
								}
										break;
						case mk3HwScreenButtons0.ccButton1:
								if (data2 === 127) {
										remoteControls.selectNextPage(true);
								}
										break;
						case mk3HwScreenButtons0.ccButton2:
								if (data2 === 127) {
										cursorDevice.selectPrevious();
								}
										break;
						case mk3HwScreenButtons0.ccButton3:
								if (data2 === 127) {
										cursorDevice.selectNext();
								}
										break;
						case mk3HwScreenButtons0.ccButton6:
								if (data2 === 127) {
										cursorDevice.isWindowOpen().toggle();
								}
										break;
						case mk3HwScreenButtons0.ccButton7:
								if (data2 === 127) {
										cursorDevice.isEnabled().toggle();
								}
										break;

// Autoparameter Knobs
						case mk3HwScreenKnobs0.ccKnob0:
								mk3Knob2WayFB(data1, data2);
										break;
						case mk3HwScreenKnobs0.ccKnob1:
								mk3Knob2WayFB(data1, data2);
										break;
						case mk3HwScreenKnobs0.ccKnob2:
								mk3Knob2WayFB(data1, data2);
										break;
						case mk3HwScreenKnobs0.ccKnob3:
								mk3Knob2WayFB(data1, data2);
										break;
						case mk3HwScreenKnobs0.ccKnob4:
								mk3Knob2WayFB(data1, data2);
										break;
						case mk3HwScreenKnobs0.ccKnob5:
								mk3Knob2WayFB(data1, data2);
										break;
						case mk3HwScreenKnobs0.ccKnob6:
								mk3Knob2WayFB(data1, data2);
										break;
						case mk3HwScreenKnobs0.ccKnob7:
								mk3Knob2WayFB(data1, data2);
										break;
// data2 default statement
							default:
									// println("shhhh... wut midi");
											break;
// end of data2 switch statement
						}
// break switch for CC1 channel
				break;
// send pitch bend data since the switch statement breaks it
				case mk3MidiChannel.PB1:
				sendMidi(status, data1, data2);
								break;
// status default
			default:
					// println("shhhh... wut midi");
							break;
// end of status switch statement
		}
// end of midi ins
}

function onSysex(data)
{
}

function exit()
{
}
