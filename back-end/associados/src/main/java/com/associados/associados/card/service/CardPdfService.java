package com.associados.associados.card.service;

import com.associados.associados.card.entity.Card;
import com.itextpdf.html2pdf.HtmlConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

import java.nio.file.Files;
import java.nio.file.Paths;

@Service
public class CardPdfService {

    @Autowired
    private TemplateEngine templateEngine;

    public byte[] generate(Card card) {
        Context context = new Context();
        context.setVariable("card", card);
        
        context.setVariable("logoBase64", loadBase64FromFile("logo_base64.txt"));
        context.setVariable("sidebarBase64", loadBase64FromFile("sidebar_base64.txt"));
        
        // TENTA buscar a foto, mas se der BusinessException, ignora e segue sem foto (Isso deve ser mudado, não deve emitir se não houver foto!)
        String fotoBase64 = null;
        try {
            if (card.getUser() != null && card.getUser().getAvatarUrl() != null && !card.getUser().getAvatarUrl().isEmpty()) {
                fotoBase64 = getBase64ImageFromUrl(card.getUser().getAvatarUrl());
            }
        } catch (Exception e) {
            System.err.println("Aviso: Associado sem foto ou erro ao carregar. Gerando carteirinha sem imagem.");
        }
        
        context.setVariable("fotoBase64", fotoBase64);

        String html = templateEngine.process("carteirinha", context);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        HtmlConverter.convertToPdf(html, outputStream);

        return outputStream.toByteArray();
    }


    private String getBase64ImageFromUrl(String imageUrl) {
        try (InputStream in = new URL(imageUrl).openStream();
             ByteArrayOutputStream out = new ByteArrayOutputStream()) {
             
            byte[] buffer = new byte[1024];
            int bytesRead;
            while ((bytesRead = in.read(buffer)) != -1) {
                out.write(buffer, 0, bytesRead);
            }
            
            byte[] imageBytes = out.toByteArray();
            return "data:image/jpeg;base64," + Base64.getEncoder().encodeToString(imageBytes);
            
        } catch (Exception e) {
            System.err.println("Aviso: Não foi possível carregar a foto do associado. URL: " + imageUrl);
            return null; // Se a foto falhar, a carteirinha é gerada sem a foto (Somente para teste, não deve-se emitir carteira sem foto)
        }
    }
    
    private String loadBase64FromFile(String fileName) {
    try {
        ClassPathResource resource = new ClassPathResource("assets/" + fileName);
        return new String(resource.getInputStream().readAllBytes(), StandardCharsets.UTF_8);
    } catch (Exception e) {
        System.err.println("Erro ao carregar imagem Base64: " + fileName);
        return "";
    }
}
}