package com.associados.associados.auth.service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.associados.associados.associate.entity.Associate;
import com.associados.associados.associate.repository.AssociateRepository;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private AssociateRepository associateRepository;

    private String birthdayMessageTemplate = "Desejamos a você um aniversário repleto de alegria, saúde e momentos inesquecíveis! "
                                           + "Que este novo ciclo seja cheio de realizações e felicidade. Obrigado por fazer parte da "
                                           + "nossa comunidade no Centro Cultural Dom Maurício.";

    public void updateBirthdayMessageTemplate(String newTemplate) {
        this.birthdayMessageTemplate = newTemplate;
    }

    public String getBirthdayMessageTemplate() {
        return this.birthdayMessageTemplate;
    }

    public void sendPasswordResetEmail(String to, String token) {
        String subject = "Password Recovery - Associates System";
        String body = "Hello!\n\nYour password recovery code is: " + token + "\n\nThis code expires in 15 minutes.";
        sendEmail(to, subject, body);
    }

    public void sendAssociateLoginEmail(String email, String token) {
        String subject = "Your Access Code - Associates Portal";
        String body = "Use the following code to access the system: " + token + 
                    "\nThis code expires in 10 minutes.";
        sendEmail(email, subject, body);
    }

    public void sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);
            
            mailSender.send(message);
        } catch (MessagingException e) {
            System.out.println("Erro ao enviar e-mail: " + e.getMessage());
        }
    }

    @Scheduled(cron = "0 0 8 * * *") // 8 da manha todo dia
    public void checkAndSendBirthdays() {
        System.out.println("Starting birthday check...");

        LocalDate hoje = LocalDate.now(ZoneId.of("America/Sao_Paulo"));
        int currentMonth = hoje.getMonthValue();
        int currentDay = hoje.getDayOfMonth();
        
        List<Associate> aniversariantes = associateRepository.findByBirthdayMonthAndDay(currentMonth, currentDay);
        
        for (Associate associado : aniversariantes) {
            
            if (associado.getUser() != null) {
                String email = associado.getUser().getEmail();
                String nome = associado.getUser().getName();
                
                sendBirthdayEmail(email, nome);
            }
        }

        System.out.println("Birthday check completed. Emails sent: " + aniversariantes.size());
    }

    public void sendBirthdayEmail(String to, String name) {
        String subject = "Grupo Cultural de Dom Maurício";
        String topoUrl = "https://lh3.googleusercontent.com/d/15NVc2eHIegUHcDhWdfM-hxvADdEII1JD"; 
        String rodapeUrl = "https://lh3.googleusercontent.com/d/1JMR_IIR0BbMJutuVQN8IB5yGVsHGDRJq"; 

        String personalizedMessage = this.birthdayMessageTemplate.replace("{name}", name);

        String body = "<!DOCTYPE html>"
                    + "<html lang=\"pt-BR\">"
                    + "<head><meta charset=\"UTF-8\"></head>"
                    + "<body style=\"margin: 0; padding: 0; width: 100% !important; background-color: #121212; font-family: Arial, sans-serif;\">"
                    + "    <table width=\"100%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\" style=\"background-color: #121212; padding: 40px 10px;\">"
                    + "        <tr>"
                    + "            <td align=\"center\">"
                    + "                <table width=\"100%\" style=\"max-width: 550px; background-color: #ebe5cf; border-radius: 12px; overflow: hidden;\">"
                    + "                    <tr><td align=\"center\"><img src=\"" + topoUrl + "\" width=\"100%\"></td></tr>"
                    + "                    <tr>"
                    + "                        <td style=\"background-color: #ebe5cf; padding: 35px 40px; text-align: center;\">"
                    + "                            <h2 style=\"color: #000000 !important; font-size: 24px; margin-bottom: 20px;\">"
                    + "                                Querido(a) " + name + ","
                    + "                            </h2>"
                    + "                            <p style=\"color: #1a1a1a !important; font-size: 16px; line-height: 1.6; margin-bottom: 20px;\">"
                    + "                                " + personalizedMessage + "" 
                    + "                            </p>"
                    + "                            <p style=\"color: #1a1a1a !important; font-size: 15px; margin-bottom: 0;\">"
                    + "                                Att.,<br><strong>O Grupo Cultural de Dom Maurício</strong>"
                    + "                            </p>"
                    + "                        </td>"
                    + "                    </tr>"
                    + "                    <tr><td align=\"center\"><img src=\"" + rodapeUrl + "\" width=\"100%\"></td></tr>"
                    + "                </table>"
                    + "            </td>"
                    + "        </tr>"
                    + "    </table>"
                    + "</body>"
                    + "</html>";

        sendEmail(to, subject, body); 
    }


}