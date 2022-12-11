import React from 'react'
import styled from "styled-components";

const CarWrapper = styled.div`
    position: relative;
    width: 30px;
    height: 20px;
`;

const MaterialIcon = () => (
    <span className="material-symbols-outlined">
        airport_shuttle
    </span >
);
const Link = styled(MaterialIcon)`
`

export default function Car({ x = 0, y = 0 }) {
    return (
        <CarWrapper x={x} y={y} >
            <Link />
        </CarWrapper>
    )
}
