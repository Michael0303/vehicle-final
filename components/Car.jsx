import React from 'react'
import styled from "styled-components";

const CarWrapper = styled.div`
    position: absolute;
    left: ${(props) => props.x}px;
    top: ${(props) => props.y}px;
    background-color: ${(props) => props.color};
    width: 30px;
    height: 20px;
    text-align: center;
    transition-duration: 1s;
    transform: translate(-50%, -50%);
    z-index: 3;
`;

const MaterialIcon = () => (
    <span className="material-symbols-outlined">
        airport_shuttle
    </span >
);
const Link = styled(MaterialIcon)`
`

export default function Car({ x = 0, y = 0, id, color, enter = false }) {
    // console.log(`car #${id} is at (${x}, ${y})`)
    return (
        <CarWrapper x={x} y={y} color={color}>
            <Link />
        </CarWrapper>
    )
}
