import styled from "styled-components";

const StyledImage = styled.img.attrs((props) => ({
  className: props.className, // 외부에서 전달된 className 병합
}))`
  object-fit: cover; // 오타 수정 (object-cover가 아닌 object-fit 사용)
  margin-bottom: 1.5rem;

  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.8))
    drop-shadow(0 0 5px rgba(255, 255, 255, 0.7))
    drop-shadow(0 0 10px rgba(255, 255, 255, 0.6));
`;

function WeaselIcon(props) {
  return (
    <div>
      <StyledImage src="/logo.png" alt="Logo" {...props} />
    </div>
  );
}

export default WeaselIcon;
