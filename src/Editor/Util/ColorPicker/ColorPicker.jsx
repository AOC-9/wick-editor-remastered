/*
 * Copyright 2020 WICKLETS LLC
 *
 * This file is part of Wick Editor.
 *
 * Wick Editor is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Wick Editor is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Wick Editor.  If not, see <https://www.gnu.org/licenses/>.
 */

import React, { useState } from 'react';
import { Popover } from 'reactstrap';
import WickColorPicker  from 'Editor/Util/ColorPicker/WickColorPicker';

import './_colorpicker.scss';

export default function ColorPicker (props) {
  const [open, setOpen] = useState(false); 
  
  const [colorMode, setColorMode] = useState('solid'); // solid | gradient
const [gradientType, setGradientType] = useState('linear'); // linear | radial
const [gradientAngle, setGradientAngle] = useState(90); // Only for linear
const [gradientStops, setGradientStops] = useState([
  { offset: 0, color: '#ff0000' },
  { offset: 1, color: '#0000ff' }
]);
const [target, setTarget] = useState('fill'); // fill | stroke | background

function getGradientCSS() {
  if (colorMode === 'solid') return gradientStops[0].color;
  const stops = gradientStops.map(s => `${s.color} ${s.offset * 100}%`).join(', ');
  if (gradientType === 'linear') {
    return `linear-gradient(${gradientAngle}deg, ${stops})`;
  }
  if (gradientType === 'radial') {
    return `radial-gradient(circle, ${stops})`;
  }
}  
  let color = props.color ? props.color : new window.Wick.Color("#FFFFFF")
  let itemID = props.id;
  let popoverID = itemID+'-popover';

  function toggle () {
    if (!open) {
      setTimeout(selectPopover, 200);
    }

    setOpen(!open)
  }

  function selectPopover () {
    let ele = document.getElementById(popoverID);
    if (ele) {
      ele.focus();
    }
  }

  return (
      <button
        className={"btn-color-picker"}
        aria-label="color picker button"
        id={itemID}
        onClick={toggle}
        style={props.stroke ? {borderColor: color} : {backgroundColor: color}}
        >
          <Popover
            tabIndex={-1}
            id={popoverID}
            placement={props.placement}
            isOpen={open}
            toggle={toggle}
            target={itemID}
            boundariesElement={'viewport'}>
            <WickColorPicker
              toggle={toggle}
              colorPickerType={props.colorPickerType}
              changeColorPickerType={props.changeColorPickerType}
              disableAlpha={props.disableAlpha}
              color={color}
              onChangeComplete={props.onChangeComplete}
              lastColorsUsed={props.lastColorsUsed}
            />
            {<div className="colorpicker-panel-tabs">
  <button onClick={() => setColorMode('solid')} className={colorMode === 'solid' ? 'active' : ''}>Solid</button>
  <button onClick={() => setColorMode('gradient')} className={colorMode === 'gradient' ? 'active' : ''}>Gradient</button>
</div>

{colorMode === 'solid' && (
  /* ...your existing solid color picker controls... */
)}

{colorMode === 'gradient' && (
  <div className="gradient-panel">
    <label>
      Target:
      <select value={target} onChange={e => setTarget(e.target.value)}>
        <option value="fill">Fill</option>
        <option value="stroke">Stroke</option>
        <option value="background">Background</option>
      </select>
    </label>
    <label>
      Type:
      <select value={gradientType} onChange={e => setGradientType(e.target.value)}>
        <option value="linear">Linear</option>
        <option value="radial">Radial</option>
      </select>
    </label>
    {gradientType === 'linear' && (
      <label>
        Angle:
        <input type="number" value={gradientAngle}
          onChange={e => setGradientAngle(Number(e.target.value))} />
      </label>
    )}
    <div className="gradient-stops">
      {gradientStops.map((stop, idx) => (
        <div key={idx}>
          <input
            type="color"
            value={stop.color}
            onChange={e => {
              const newStops = [...gradientStops];
              newStops[idx].color = e.target.value;
              setGradientStops(newStops);
            }}
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={stop.offset}
            onChange={e => {
              const newStops = [...gradientStops];
              newStops[idx].offset = parseFloat(e.target.value);
              setGradientStops(
          </Popover>
      </button>
  )
}
