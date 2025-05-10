class StorageService {
  // Room and user management
  saveRoomSession(roomId, userName) {
    sessionStorage.setItem('roomId', roomId);
    sessionStorage.setItem('userName', userName);
  }

  getRoomSession() {
    const roomId = sessionStorage.getItem('roomId');
    const userName = sessionStorage.getItem('userName');
    return { roomId, userName };
  }

  clearRoomSession() {
    sessionStorage.removeItem('roomId');
    sessionStorage.removeItem('userName');
  }

  // Code persistence
  saveCode(code) {
    sessionStorage.setItem('code', code);
  }

  getCode() {
    return sessionStorage.getItem('code');
  }

  clearCode() {
    sessionStorage.removeItem('code');
  }

  // Language persistence
  saveLanguage(language) {
    sessionStorage.setItem('language', language);
  }

  getLanguage() {
    return sessionStorage.getItem('language');
  }

  clearLanguage() {
    sessionStorage.removeItem('language');
  }

  // Video call state
  saveVideoCallState(inVideoCall) {
    if (inVideoCall) {
      sessionStorage.setItem('inVideoCall', 'true');
    } else {
      sessionStorage.removeItem('inVideoCall');
    }
  }

  getVideoCallState() {
    return sessionStorage.getItem('inVideoCall') === 'true';
  }

  // Whiteboard state
  saveWhiteboardState(showWhiteboard) {
    if (showWhiteboard) {
      sessionStorage.setItem('showWhiteboard', 'true');
    } else {
      sessionStorage.removeItem('showWhiteboard');
    }
  }

  getWhiteboardState() {
    return sessionStorage.getItem('showWhiteboard') === 'true';
  }

  // Clear all session data
  clearAllSessionData() {
    this.clearRoomSession();
    this.clearCode();
    this.clearLanguage();
    this.saveVideoCallState(false);
    this.saveWhiteboardState(false);
  }

  // Check if user has an active session
  hasActiveSession() {
    const { roomId, userName } = this.getRoomSession();
    return !!(roomId && userName);
  }
}

export default new StorageService();