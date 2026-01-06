package com.example.demo.controller;


import com.example.demo.model.Team;
import com.example.demo.repository.TeamRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin
public class TeamController {


    private final TeamRepository repo;

    public TeamController(TeamRepository repo){
        this.repo = repo;
    }

    @GetMapping
    public List<Team> getAll(){
        return repo.findAll();
    }

    @PostMapping
    public Team create(@RequestBody Team team) {
        return repo.save(team);
    }

    @PutMapping("/{id}")
    public Team update(@PathVariable Long id, @RequestBody Team updated){
        Team t = repo.findById(id).orElseThrow();

        // 1. Actualizăm Numele
        t.setName(updated.getName());

        // 2. Actualizăm și POZA (Aceasta este linia care lipsea!)
        t.setImageUrl(updated.getImageUrl());

        return repo.save(t);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id){
        repo.deleteById(id);
    }
}
