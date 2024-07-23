import React, {useState} from 'react';

interface IDateBlockProps {
    color: string,
    border: string,
    onClick: () => void
}

function DateBlock(props: IDateBlockProps) {
    const [isHover, setIsHover] = useState(false)

    return <div
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={props.onClick}
        style={{
            background: isHover ? "bisque" : props.color,
            width: "15px",
            height: "15px",
            border: `${props.border}`
        }}
    />
}

export default React.memo(DateBlock)