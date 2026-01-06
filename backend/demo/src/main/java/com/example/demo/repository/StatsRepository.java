package com.example.demo.repository;

import com.example.demo.model.Stats;
import com.example.demo.model.Player;
import com.example.demo.model.Tournament;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StatsRepository extends JpaRepository<Stats, Long> {
    Optional<Stats> findByPlayerAndTournament(Player player, Tournament tournament);
}
