package com.project.fitness_monolith.controller;

import com.project.fitness_monolith.dto.ActivityRequest;
import com.project.fitness_monolith.dto.ActivityResponse;
import com.project.fitness_monolith.model.Activity;
import com.project.fitness_monolith.repository.ActivityRepository;
import com.project.fitness_monolith.service.ActivityService;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityRepository activityRepository;
    private final ActivityService activityService;

    @PostMapping("/activity")
    public ResponseEntity<ActivityResponse> trackActivity(@RequestBody ActivityRequest request){
        return ResponseEntity.ok(activityService.trackActivity(request));
    }

    @GetMapping()
    public ResponseEntity<List<ActivityResponse>> getUserActivity(
            @RequestHeader(value="X-User-ID") String userId
    ){
        return ResponseEntity.ok(activityService.getUserActivities(userId));
    }
}
