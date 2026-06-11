package com.project.fitness_monolith.controller;

import com.project.fitness_monolith.dto.RecommendationRequest;
import com.project.fitness_monolith.dto.RecommendationResponse;
import com.project.fitness_monolith.model.Recommendation;
import com.project.fitness_monolith.service.RecommendationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recommendation")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"})
public class RecommendationController {

    private final RecommendationService recommendationService;

    @PostMapping("/generate")
    public ResponseEntity<Recommendation> generateRecommendation(
            @RequestBody RecommendationRequest request){
        Recommendation recommendation = recommendationService.generateRecommendation(request);
        return ResponseEntity.ok(recommendation);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Recommendation>> getUserRecommendation(
            @PathVariable String userId){
        List<Recommendation> recommendationList
                = recommendationService.getUserRecommendation(userId);

        return ResponseEntity.ok(recommendationList);
    }
}
