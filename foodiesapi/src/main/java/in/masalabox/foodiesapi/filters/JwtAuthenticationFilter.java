package in.masalabox.foodiesapi.filters;

import in.masalabox.foodiesapi.util.JwtUtil;
import java.util.Arrays;
import java.util.List;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.lang.NonNull;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpMethod;
import org.springframework.security.web.servlet.util.matcher.PathPatternRequestMatcher;
import org.springframework.security.web.util.matcher.RequestMatcher;

import java.io.IOException;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final PathPatternRequestMatcher.Builder MATCHER = PathPatternRequestMatcher.withDefaults();

    // Define public paths that should be ignored by the filter
    private final List<RequestMatcher> publicMatchers = Arrays.asList(
        // Allow GET access to /api/foods without a token (for menu viewing)
        MATCHER.matcher(HttpMethod.GET, "/api/foods/**"), 
        
        // Allow POST access for registration/login
        MATCHER.matcher(HttpMethod.POST, "/api/register"),
        MATCHER.matcher(HttpMethod.POST, "/api/login"),
        MATCHER.matcher(HttpMethod.POST, "/api/admin/auth/register"),
        MATCHER.matcher(HttpMethod.POST, "/api/admin/auth/login"),

        MATCHER.matcher("/ws/**"),
        MATCHER.matcher("/error")
    );

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    @Qualifier("delegatingUserDetailsService")
    private UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(@NonNull HttpServletRequest request) throws ServletException {
        return publicMatchers.stream().anyMatch(matcher -> matcher.matches(request));
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            
            try {
                String email = jwtUtil.extractUsername(token);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                    if (jwtUtil.validateToken(token, userDetails)) {
                        UsernamePasswordAuthenticationToken authenticationToken =
                                new UsernamePasswordAuthenticationToken(
                                        userDetails,
                                        null,
                                        userDetails.getAuthorities()
                                );
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                        
                        // CHANGE: Helpful log for development
                        System.out.println("JWT Filter: Authenticated user " + email);
                    } else {
                        // CHANGE: Log if validation fails
                        System.out.println("JWT Filter: Token validation FAILED for " + email);
                    }
                }
            } catch (Exception e) {
                // CHANGE: Log the specific error (expired token, malformed, etc.)
                System.err.println("JWT Filter Error: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }


}
