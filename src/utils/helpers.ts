import * as fs from 'fs/promises';

const deleteFile = async (path) => {
  try {
    await fs.unlink(path);
  } catch (error) {
    console.log(error);
  }
};

export default { deleteFile };
