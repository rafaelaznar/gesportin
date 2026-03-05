package net.ausiasmarch.gesportin.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JWTService {

    @Value("${jwt.secret}")
    private String SECRET_KEY;
    @Value("${jwt.issuer}")
    private String ISSUER;
    @Value("${jwt.subject}")
    private String SUBJECT;

    public String validate(String strToken) {
        Jws<Claims> jws = Jwts.parserBuilder()
                .setSigningKey(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .build()
                .parseClaimsJws(strToken);
        if (jws == null || jws.getBody() == null) {
            return null; // token no válido
        } else {

            // comprobar expiración del token
            if (jws.getBody().getExpiration().before(new java.util.Date())) {
                return null; // token expirado
            }

            // compprobar que la fecha de emisión es anterior a la fecha actual
            if (jws.getBody().getIssuedAt().after(new java.util.Date())) {
                return null; // token no válido
            }

            // comprobar que la emisión del token es correcta
            if (!ISSUER.equals(jws.getBody().getIssuer())) {
                return null; // emisor no válido
            }

            //comprobar el asunto del token
            if (!SUBJECT.equals(jws.getBody().getSubject())) {
                return null; // asunto no válido
            }

            // extraer el nombre de usuario del token
            String username = jws.getBody().get("username", String.class);
            return username;
        }
    }

    public String generateJWT(String username, Long usertype, Long id_club) {
        return Jwts.builder()
                .setIssuer(ISSUER)
                .setSubject(SUBJECT)
                .claim("username", username)
                .claim("usertype", usertype)
                .claim("club", id_club)
                .setIssuedAt(new java.util.Date())
                .setExpiration(new java.util.Date(System.currentTimeMillis() + 10800000)) // 3 horas
                .signWith(Keys.hmacShaKeyFor(SECRET_KEY.getBytes()))
                .compact();
    }

}
