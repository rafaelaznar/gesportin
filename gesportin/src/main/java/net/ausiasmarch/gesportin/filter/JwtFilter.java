package net.ausiasmarch.gesportin.filter;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import net.ausiasmarch.gesportin.service.JWTService;

@Component
public class JwtFilter implements Filter {

    @Autowired
    private JWTService oJwtService;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response,
            FilterChain chain) throws IOException, ServletException {

        HttpServletResponse httpResponse = (HttpServletResponse) response;
        HttpServletRequest httpRequest = (HttpServletRequest) request;

        // Add CORS headers
        String origin = httpRequest.getHeader("Origin");
        if (origin != null) {
            httpResponse.setHeader("Access-Control-Allow-Origin", origin);
        } else {
            httpResponse.setHeader("Access-Control-Allow-Origin", "*");
        }
        httpResponse.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
        httpResponse.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
        httpResponse.setHeader("Access-Control-Allow-Credentials", "true");
        httpResponse.setHeader("Access-Control-Max-Age", "3600");

        if ("OPTIONS".equalsIgnoreCase(httpRequest.getMethod())) {
            httpResponse.setStatus(HttpServletResponse.SC_OK);
            chain.doFilter(request, response);
        } else {
            // aqui el código de una consulta que no es preflight
            String authToken = httpRequest.getHeader("Authorization");
            if (authToken != null && authToken.startsWith("Bearer ")) {
                authToken = authToken.substring(7);
            } else {
                // Fallback para EventSource/SSE: el navegador no puede enviar cabeceras personalizadas
                authToken = httpRequest.getParameter("token");
            }
            if (authToken != null) {
                // debug
                System.out.println("Method: " + httpRequest.getMethod());
                System.out.println("URL: " + httpRequest.getRequestURL().toString());
                System.out.println("Auth Token: " + authToken);
                // Validar el token JWT
                try {
                    // Aquí va la lógica para validar el token JWT
                    // Si el token es válido, continuar con la cadena de filtros
                    String username = oJwtService.validate(authToken);
                    if (username != null) {
                        // Si el token es válido, continuar con la cadena de filtros
                        httpRequest.setAttribute("username", username);
                        chain.doFilter(request, response);
                    } else {
                        httpRequest.setAttribute("username", null);
                        // Si el token no es válido, devolver un error 401
                        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                        return;
                    }
                } catch (Exception e) {
                    httpRequest.setAttribute("username", null);
                    // Si el token no es válido, devolver un error 401
                    httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    return;
                }
            } else {
                System.out.println("Method: " + httpRequest.getMethod());
                System.out.println("URL: " + httpRequest.getRequestURL().toString());
                System.out.println("Auth Token: No se ha proporcionado");
                httpRequest.setAttribute("username", null);
                chain.doFilter(request, response);
            }
        }
    }
}
