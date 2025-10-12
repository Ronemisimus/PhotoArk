const API_URL = 'http://localhost:3000'; // This should be in an env file

export const apiService = {
  getMedia: async () => {
    try {
      const response = await fetch(`${API_URL}/media`);
      if (!response.ok) {
        throw new Error('Failed to fetch media');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  getUploadUrl: async (filename: string, thumbnailFilename: string, mediaType: 'photo' | 'video') => {
    try {
      const response = await fetch(`${API_URL}/media/upload-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filename, thumbnailFilename, mediaType }),
      });
      if (!response.ok) {
        throw new Error('Failed to get upload URL');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },

  uploadFile: async (uploadUrl: string, fileUri: string, fileType: string) => {
    try {
      const response = await fetch(fileUri);
      const blob = await response.blob();

      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': fileType,
        },
        body: blob,
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },

  createMediaRecord: async (title: string, description: string, url: string, thumbnailUrl: string, mediaType: 'photo' | 'video') => {
    try {
      const response = await fetch(`${API_URL}/media`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, url, thumbnailUrl, mediaType }),
      });
      if (!response.ok) {
        throw new Error('Failed to create media record');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  },
};
