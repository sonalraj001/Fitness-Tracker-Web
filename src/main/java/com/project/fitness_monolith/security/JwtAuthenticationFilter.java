package com.project.fitness_monolith.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static java.util.stream.StreamSupport.stream;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter{


        @Autowired
        private JwtUtils jwtUtils;


        @Override
        protected void doFilterInternal (HttpServletRequest request,
                                         HttpServletResponse response,
                                         FilterChain filterChain) throws ServletException, IOException {
            System.out.println("AuthTokenFilter Called");
            try {
                String jwt = parseJwt(request);

                if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                    System.out.println("Token there:" + jwt);
                    String userId = jwtUtils.getUserIdFromToken(jwt);
//                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                    Claims claims = jwtUtils.getAllClaims(jwt);
                    List<String> roles = claims.get("roles", List.class);
                    System.out.println("ROLE: " + roles);
                    List<GrantedAuthority> authorities =  new ArrayList<>();
                    if (roles != null) {
                        authorities = roles
                                .stream()
                                .map(role -> (GrantedAuthority) new SimpleGrantedAuthority(role))
                                .collect(Collectors.toList());
                    }
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userId,
                                    null,
                                    authorities);
                    authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authentication);

                }
            } catch (Exception e) {
                e.printStackTrace();
            }

            filterChain.doFilter(request, response);
        }

        private String parseJwt (HttpServletRequest request){
        String jwt = jwtUtils.getJwtFromHeader(request);
        return jwt;
        }

}
