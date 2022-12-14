import styled from "styled-components";
import { useState } from "react";
import CarModalPerLine from "./CarModalPerLine";
import { Button } from "antd";
import Car from "./Car";

const LaneBlock = styled.div`
    position: absolute;
    top: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
    background-color: gray;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    border-top: 5px solid white;
    border-bottom: 5px solid white;
    display: flex;
    // justify-content: flex-start;
    align-items: center;
`;
//   top: ${(props) => props.originX}px;
//   left: ${(props) => props.originY}px;



const Lane = ({ x = 0, y = 0, width, height, cars, setCars, idx }) => {
    const [modalPerLineOpen, setModalPerLineOpen] = useState(false)
    console.log(`block #${idx} is at (${x}, ${y})`)
    return <LaneBlock x={x} y={y} width={width} height={height}>
        {(idx !== -1) ? <Button onClick={() => setModalPerLineOpen(true)}>Add</Button> : null}
        {(idx !== -1) ? cars[idx].map((time, index) => time > 0 ? <Car key={"Car" + index} id={"Car" + index} x={20 * time} color={"pink"} /> : <Car key={"Car" + index} id={"Car" + index} x={-10} color={"blue"} />) : null}
        <CarModalPerLine
            open={modalPerLineOpen}
            onCreate={({ time }) => {
                setCars(cars.map((car_line, index) => {
                    if (index === idx) {
                        car_line.push(time)
                    }
                    return car_line
                }))
                setModalPerLineOpen(false)
            }}
            onCancel={() => {
                setModalPerLineOpen(false)
            }}
            index={idx}
        />
    </LaneBlock >
};

export default Lane;
