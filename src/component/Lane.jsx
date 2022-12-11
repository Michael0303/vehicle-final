import styled from "styled-components";
import { useState } from "react";

const LaneBlock = styled.div`
    position: absolute;
    top: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
    background-color: gray;
    width: ${(props) => props.width}px;
    height: ${(props) => props.height}px;
    border-top: 5px solid white;
    border-bottom: 5px solid white;
`;
//   top: ${(props) => props.originX}px;
//   left: ${(props) => props.originY}px;

const Lane = ({ x = 0, y = 0, width, height }) => {
    return <LaneBlock x={x} y={y} width={width} height={height}></LaneBlock>;
};

export default Lane;
