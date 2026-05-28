package net.ausiasmarch.gesportin.util;

import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;

import javax.imageio.IIOImage;
import javax.imageio.ImageIO;
import javax.imageio.ImageWriteParam;
import javax.imageio.ImageWriter;

public class ImageCompressor {
    
    public static byte[] compressImage(byte[] imageBytes) throws IOException {

        BufferedImage image = ImageIO.read(new ByteArrayInputStream(imageBytes));
        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

        ImageWriter writer = ImageIO.getImageWritersByFormatName("webp").next();
        ImageWriteParam param = writer.getDefaultWriteParam();

        param.setCompressionMode(ImageWriteParam.MODE_EXPLICIT);
        param.setCompressionQuality(0.7f);

        writer.setOutput(ImageIO.createImageOutputStream(outputStream));
        writer.write(null, new IIOImage(image, null, null), param);
        writer.dispose();

        return outputStream.toByteArray();
    }
}