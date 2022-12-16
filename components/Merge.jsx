import styled from "styled-components";

const MergeBlock = styled.div`
    position: absolute;
    top: ${(props) => props.y}px;
    left: ${(props) => props.x}px;
    height: ${(props) => props.height}px;
    border-left: ${(props) => props.width}px solid gray;
    border-top: ${(props) => props.retractLength}px solid transparent;
    border-bottom: ${(props) => props.retractLength}px solid transparent;
    transform: translate(0%, -50%);
    z-index: 0;
`;

const Merge = ({ x = 0, y = 0, width, height, mergeHeight }) => {
    const retractLength = (height - mergeHeight) / 2;
    return (
        <MergeBlock
            retractLength={retractLength}
            height={mergeHeight}
            width={width}
            x={x}
            y={y}
        />
    );
};
export default Merge;
