/** @jsxImportSource @emotion/react */
import React from 'react'
import {
  BubbleContainer,
  BubbleWrapper,
  ProfileImage,
  ProfileContainer,
  TimeInfo,
  ReadStatus,
  MessageContainer,
} from '../../styles/BubbleStyles'
import Emoticon from '../emoticon/Emoticon'

interface BubbleProps {
  children: React.ReactNode
  isMe?: boolean
  profileImage?: string
  timestamp?: string
  showTime?: boolean
  isLastMessage?: boolean
  isRead?: boolean
  isContinuous?: boolean
  onProfileClick?: () => void // 프로필 클릭 핸들러 추가
}

const Bubble: React.FC<BubbleProps> = ({
  children,
  isMe = true,
  profileImage = '',
  timestamp = '',
  showTime = false,
  isLastMessage = false,
  isRead = false,
  isContinuous = false,
  onProfileClick, // 프로필 클릭 핸들러 받기
}) => {
  // 프로필 이미지 클릭 핸들러
  const handleProfileImageClick = (e: React.MouseEvent) => {
    e.stopPropagation() // 부모 요소의 클릭 이벤트 방지
    if (onProfileClick) {
      onProfileClick()
    }
  }

  const checkForEmoticon = (child: React.ReactNode): boolean => {
    // React 요소인지 확인
    if (!React.isValidElement(child)) return false

    // Emoticon인 경우
    if (child.type === Emoticon) return true

    // div와 같은 요소로 감싸져 있는 경우
    const props = child.props as { children?: React.ReactNode }

    // 단일 자식인 경우
    if (React.isValidElement(props.children)) {
      return checkForEmoticon(props.children)
    }

    // 여러 자식이 있는 경우 (배열)
    if (Array.isArray(props.children)) {
      return props.children.some((grandChild: React.ReactNode) =>
        checkForEmoticon(grandChild)
      )
    }

    return false
  }

  // 채팅 내용이 이모티콘인지 확인
  const isEmoticon = React.Children.toArray(children).some((child) =>
    checkForEmoticon(child)
  )

  return (
    <BubbleWrapper
      isMe={isMe}
      isContinuous={isContinuous}
      isEmoticon={isEmoticon}
    >
      {!isMe &&
        (profileImage && !isContinuous ? (
          <ProfileImage
            src={profileImage}
            alt="프로필"
            onClick={handleProfileImageClick} // 클릭 이벤트 추가
            // style={{
            //   cursor: onProfileClick ? 'pointer' : 'default', // 클릭 가능할 때만 포인터 커서
            // }}
            title={onProfileClick ? '프로필 보기' : undefined} // 툴팁 추가
            onError={(e) => {
              console.error('프로필 이미지 로드 실패:', profileImage)
              // 기본 이미지로 대체
              e.currentTarget.src = '/default-profile-image.png'
            }}
          />
        ) : (
          <ProfileContainer />
        ))}
      <MessageContainer isMe={isMe} isEmoticon={isEmoticon}>
        <BubbleContainer isMe={isMe} isEmoticon={isEmoticon}>
          {children}
        </BubbleContainer>
        {showTime && !isLastMessage && <TimeInfo>{timestamp}</TimeInfo>}
        {isMe && isLastMessage && (
          <ReadStatus>{isRead ? '읽음' : '읽지 않음'}</ReadStatus>
        )}
      </MessageContainer>
    </BubbleWrapper>
  )
}

export default Bubble
