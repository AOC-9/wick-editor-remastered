/*
 * Copyright I don't know
 */

import React, { Component } from 'react';

import './_inspectorframepicker.scss';

import WickInput from 'Editor/Util/WickInput/WickInput';
import InspectorFrameButton from './InspectorFrameButton/InspectorFrameButton';

class InspectorFramePicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showFramePicker: false
        };
        this.project = this.props.project;
        this.getActive = this.props.getActive;
        this.onChange = this.props.onChange;
    }
    fetchSVGs() {
        let selectClip = this.project.selection.getSelectedObject();
        let layers = selectClip.timeline.layers;
        let visibleLayers = layers.filter(layer => !layer.hidden);
        visibleLayers.reverse();
        
        let frameBounds = [];
        visibleLayers.forEach(layer => {
            layer.frames.forEach(frame => {
                frameBounds[frame.start] = true;
                frameBounds[frame.end + 1] = true;
            });
        });
        frameBounds.pop();

        let clipFrameImages = [];
        frameBounds.forEach((isFrameChange, index) => {
            let layerFrameSVGContent = '';
            let svgBounds;
            visibleLayers.forEach(layer => {
                let frame = layer.getFrameAtPlayheadPosition(index);
                if (!frame) return;
                let framePath = frame.view.objectsLayer;
                if (!svgBounds) svgBounds = framePath.bounds;
                else svgBounds = svgBounds.unite(framePath.bounds);

                let frameSVG = framePath.exportSVG({asString: true});
                layerFrameSVGContent += frameSVG;
            });

            let viewBox = `viewBox="${svgBounds.x} ${svgBounds.y} ${svgBounds.width} ${svgBounds.height}"`;
            let layerFrameSVG = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" ${viewBox}>${layerFrameSVGContent}</svg>`

            let encodedFrame = window.btoa(layerFrameSVG);
            clipFrameImages.push([`data:image/svg+xml;base64,${encodedFrame}`, index]);
        });

        return clipFrameImages.map(item => [(<img src={item[0]} alt="" />), item[1]]);
    }

    render() {
        let switchFramePicker = previous => {
            return {showFramePicker: !previous.showFramePicker};
        }

        let frameButtons = this.fetchSVGs().map((item) => {
            return (<InspectorFrameButton label={item[1]} key={item[1]} onClick={() => this.onChange(item[1])} isActive={this.getActive() === item[1]}>{item[0]}</InspectorFrameButton>);
        });
        return (
            <>
                <WickInput type="button" className="framePicker-switch"
                onClick={
                    () => this.setState(switchFramePicker)
                }>
                    Toggle Frame Picker
                </WickInput>
                {this.state.showFramePicker && frameButtons}
            </>
        );
    }
}

export default InspectorFramePicker